import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListFoundries,
  getListFoundriesQueryKey,
  useListDrcRuns,
  getListDrcRunsQueryKey,
  getGetDrcStatsQueryKey,
  useSetFoundryOverride,
  useDeleteFoundryOverride,
} from '@workspace/api-client-react';
import type { FoundryLayer } from '@workspace/api-client-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Upload, File, Loader2, Pencil, RotateCcw, Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/status-badge';
import type { DrcResult } from '@workspace/api-client-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFoundryId, setSelectedFoundryId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [itarConfirmed, setItarConfirmed] = useState(false);

  // Rule-editing state
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [editGridSize, setEditGridSize] = useState('');
  const [editLayers, setEditLayers] = useState<FoundryLayer[]>([]);

  const { data: foundries, isLoading: isLoadingFoundries } = useListFoundries();
  const { data: recentRuns } = useListDrcRuns({ limit: 5 });
  const setOverride = useSetFoundryOverride();
  const deleteOverride = useDeleteFoundryOverride();

  const selectedFoundry = foundries?.find((f) => f.id === selectedFoundryId);

  // Build a lookup from (layer/datatype) → default layer for diff highlighting
  const defaultLayerMap = selectedFoundry?.defaults
    ? new Map(selectedFoundry.defaults.layers.map((l) => [`${l.layer}/${l.datatype}`, l]))
    : null;
  const isGridChanged =
    selectedFoundry?.hasOverride &&
    selectedFoundry.defaults != null &&
    selectedFoundry.gridSize !== selectedFoundry.defaults.gridSize;

  const handleFoundryChange = (id: string) => {
    setSelectedFoundryId(id);
    setIsEditingRules(false);
  };

  const openEditor = () => {
    if (!selectedFoundry) return;
    setEditGridSize(String(selectedFoundry.gridSize));
    setEditLayers(selectedFoundry.layers.map((l) => ({ ...l })));
    setIsEditingRules(true);
  };

  const cancelEdit = () => setIsEditingRules(false);

  const updateEditLayer = (idx: number, field: keyof FoundryLayer, raw: string) => {
    setEditLayers((prev) =>
      prev.map((l, i) =>
        i === idx
          ? { ...l, [field]: field === 'name' ? raw : parseFloat(raw) || 0 }
          : l
      )
    );
  };

  const handleSaveOverride = () => {
    if (!selectedFoundry) return;
    const gridSize = parseFloat(editGridSize);
    if (isNaN(gridSize) || gridSize <= 0) {
      toast({ title: 'Invalid grid size', variant: 'destructive' });
      return;
    }
    setOverride.mutate(
      { id: selectedFoundry.id, data: { gridSize, layers: editLayers } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFoundriesQueryKey() });
          setIsEditingRules(false);
          toast({ title: 'Custom rules saved', description: 'DRC will now use your values.' });
        },
        onError: (err) => {
          toast({
            title: 'Failed to save',
            description: err instanceof Error ? err.message : 'Unknown error',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleResetOverride = () => {
    if (!selectedFoundry) return;
    deleteOverride.mutate(
      { id: selectedFoundry.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFoundriesQueryKey() });
          setIsEditingRules(false);
          toast({ title: 'Rules reset to defaults' });
        },
        onError: (err) => {
          toast({
            title: 'Failed to reset',
            description: err instanceof Error ? err.message : 'Unknown error',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const gdsFile = files.find((f) => /\.gds(ii)?$/i.test(f.name));
    if (gdsFile) {
      setSelectedFile(gdsFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .gds or .gdsii file',
        variant: 'destructive',
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // The HTML `accept` attribute is a UI hint only — browsers don't enforce it.
    // Validate the extension here so arbitrary files are rejected before upload.
    if (!/\.gds(ii)?$/i.test(file.name)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .gds or .gdsii file',
        variant: 'destructive',
      });
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedFoundryId) return;

    setIsUploading(true);

    // Abort automatically if the server takes longer than 150 s (slightly more
    // than the server's 120 s DRC timeout, so the server error arrives first).
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), 150_000);

    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('foundryId', selectedFoundryId);

      const res = await fetch(`${BASE}/api/drc/check`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server returned ${res.status}`);
      }

      const result: DrcResult = await res.json();

      queryClient.invalidateQueries({ queryKey: getListDrcRunsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDrcStatsQueryKey() });

      toast({
        title: 'DRC check complete',
        description: `${result.status === 'pass' ? 'No critical findings in this preliminary screen' : `${result.violationCount} findings returned`}`,
      });

      setLocation(`/results/${result.id}`);
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === 'AbortError';
      toast({
        title: 'Upload failed',
        description: isAbort
          ? 'The request timed out. Please try again with a smaller file or check your connection.'
          : error instanceof Error ? error.message : 'Could not process DRC check. Please try again.',
        variant: 'destructive',
      });
    } finally {
      clearTimeout(abortTimer);
      setIsUploading(false);
    }
  };

  const isSaving = setOverride.isPending;
  const isResetting = deleteOverride.isPending;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design Rule Check</h1>
          <p className="text-muted-foreground mt-1">
            Upload a GDSII layout file for preliminary geometry screening against configurable reference thresholds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Reference Profile</CardTitle>
              <CardDescription>Choose the target platform for preliminary screening — not official foundry sign-off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="foundry">Foundry</Label>
                <Select value={selectedFoundryId} onValueChange={handleFoundryChange}>
                  <SelectTrigger id="foundry" data-testid="select-foundry">
                    <SelectValue placeholder="Select a foundry" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingFoundries ? (
                      <div className="p-2 text-sm text-muted-foreground">Loading foundries...</div>
                    ) : (
                      foundries?.map((foundry) => (
                        <SelectItem key={foundry.id} value={foundry.id}>
                          {foundry.name} — {foundry.technology}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedFoundry && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{selectedFoundry.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedFoundry.description}</p>
                    </div>
                    {!isEditingRules && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openEditor}
                        className="shrink-0 gap-1.5"
                      >
                        <Pencil className="w-3 h-3" />
                        {selectedFoundry.hasOverride ? 'Edit Custom Rules' : 'Override Rules'}
                      </Button>
                    )}
                  </div>

                  {selectedFoundry.hasOverride && !isEditingRules && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      Custom rules active — values below reflect your overrides
                    </div>
                  )}

                  {/* Grid size */}
                  {isEditingRules ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground font-mono w-12 shrink-0">Grid</span>
                      <Input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        value={editGridSize}
                        onChange={(e) => setEditGridSize(e.target.value)}
                        className="h-7 text-xs font-mono w-32"
                      />
                      <span className="text-muted-foreground">µm</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground font-mono">
                      Grid:{' '}
                      <span className={cn('font-semibold', isGridChanged ? 'text-amber-600 dark:text-amber-400' : 'text-foreground')}>
                        {selectedFoundry.gridSize} µm
                      </span>
                      {isGridChanged && selectedFoundry.defaults && (
                        <span className="text-amber-500/70 ml-1">(default: {selectedFoundry.defaults.gridSize} µm)</span>
                      )}
                      {!isGridChanged && (
                        <span> ({Math.round(selectedFoundry.gridSize * 1000)} nm manufacturing grid, applies to all layers)</span>
                      )}
                    </div>
                  )}

                  {/* Per-layer rules table */}
                  <div className="overflow-x-auto">
                    {isEditingRules ? (
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="text-left py-1.5 pr-2 font-semibold">Layer</th>
                            <th className="text-left py-1.5 pr-2 font-semibold">Name</th>
                            <th className="text-right py-1.5 pr-2 font-semibold">Min Width (µm)</th>
                            <th className="text-right py-1.5 pr-2 font-semibold">Min Spacing (µm)</th>
                            <th className="text-right py-1.5 font-semibold">Min Bend R (µm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editLayers.map((layer, idx) => (
                            <tr key={`${layer.layer}/${layer.datatype}`} className="border-b border-border/50 last:border-0">
                              <td className="py-1.5 pr-2 text-muted-foreground whitespace-nowrap">
                                {layer.layer}/{layer.datatype}
                              </td>
                              <td className="py-1.5 pr-2">
                                <Input
                                  value={layer.name}
                                  onChange={(e) => updateEditLayer(idx, 'name', e.target.value)}
                                  className="h-7 text-xs font-mono w-44"
                                />
                              </td>
                              <td className="py-1.5 pr-2 text-right">
                                <Input
                                  type="number"
                                  step="0.001"
                                  min="0"
                                  value={layer.minWidth}
                                  onChange={(e) => updateEditLayer(idx, 'minWidth', e.target.value)}
                                  className="h-7 text-xs font-mono w-24 text-right ml-auto"
                                />
                              </td>
                              <td className="py-1.5 pr-2 text-right">
                                <Input
                                  type="number"
                                  step="0.001"
                                  min="0"
                                  value={layer.minSpacing}
                                  onChange={(e) => updateEditLayer(idx, 'minSpacing', e.target.value)}
                                  className="h-7 text-xs font-mono w-24 text-right ml-auto"
                                />
                              </td>
                              <td className="py-1.5 text-right">
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  value={layer.minBendRadius}
                                  onChange={(e) => updateEditLayer(idx, 'minBendRadius', e.target.value)}
                                  className="h-7 text-xs font-mono w-24 text-right ml-auto"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="text-left py-1.5 pr-3 font-semibold">Layer</th>
                            <th className="text-left py-1.5 pr-3 font-semibold">Name</th>
                            <th className="text-right py-1.5 pr-3 font-semibold">Min Width</th>
                            <th className="text-right py-1.5 pr-3 font-semibold">Min Spacing</th>
                            <th className="text-right py-1.5 font-semibold">Min Bend R</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedFoundry.layers.map((layer) => {
                            const def = defaultLayerMap?.get(`${layer.layer}/${layer.datatype}`);
                            const wChanged = def != null && layer.minWidth !== def.minWidth;
                            const sChanged = def != null && layer.minSpacing !== def.minSpacing;
                            const bChanged = def != null && layer.minBendRadius !== def.minBendRadius;
                            const changed = cn('font-semibold text-amber-600 dark:text-amber-400');
                            return (
                              <tr key={`${layer.layer}/${layer.datatype}`} className="border-b border-border/50 last:border-0">
                                <td className="py-1.5 pr-3 text-muted-foreground">{layer.layer}/{layer.datatype}</td>
                                <td className="py-1.5 pr-3 font-medium">{layer.name}</td>
                                <td className="py-1.5 pr-3 text-right">
                                  <span className={wChanged ? changed : undefined}>{layer.minWidth} µm</span>
                                  {wChanged && def && <span className="block text-amber-500/60 text-[10px]">was {def.minWidth}</span>}
                                </td>
                                <td className="py-1.5 pr-3 text-right">
                                  <span className={sChanged ? changed : undefined}>{layer.minSpacing} µm</span>
                                  {sChanged && def && <span className="block text-amber-500/60 text-[10px]">was {def.minSpacing}</span>}
                                </td>
                                <td className="py-1.5 text-right">
                                  <span className={bChanged ? changed : undefined}>
                                    {layer.minBendRadius > 0 ? `${layer.minBendRadius} µm` : 'N/A'}
                                  </span>
                                  {bChanged && def && (
                                    <span className="block text-amber-500/60 text-[10px]">
                                      was {def.minBendRadius > 0 ? `${def.minBendRadius}` : 'N/A'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Edit action bar */}
                  {isEditingRules ? (
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveOverride}
                        disabled={isSaving}
                        className="gap-1.5"
                      >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Save Custom Rules
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={isSaving}
                        className="gap-1.5"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                      {selectedFoundry.hasOverride && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleResetOverride}
                          disabled={isResetting}
                          className="gap-1.5 text-muted-foreground ml-auto"
                        >
                          {isResetting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                          Reset to Defaults
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      {selectedFoundry.hasOverride
                        ? 'Using your custom values — click "Edit Custom Rules" to change or reset.'
                        : 'Public reference estimates — use a customer-approved rule source and the foundry’s official flow before submission.'}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Upload Layout</CardTitle>
                  <CardDescription>Supports .gds and .gdsii format · Do not upload files subject to ITAR or EAR export-license requirements</CardDescription>
                </div>
                <a
                  href={`${import.meta.env.BASE_URL}sample_layout.gds`}
                  download="photonlint_sample_layout.gds"
                  className="shrink-0 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download sample file
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer',
                  isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                  selectedFile && 'border-primary bg-primary/5'
                )}
                onClick={() => fileInputRef.current?.click()}
                data-testid="dropzone-upload"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".gds,.gdsii"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-file"
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <File className="w-12 h-12 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drop GDS file here or click to browse</p>
                      <p className="text-sm text-muted-foreground mt-1">Supports .gds and .gdsii format</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ITAR / EAR per-upload attestation */}
          <label className="flex items-start gap-3 cursor-pointer select-none px-1">
            <Checkbox
              id="itar-confirm"
              checked={itarConfirmed}
              onCheckedChange={(v) => setItarConfirmed(v === true)}
              className="mt-0.5 shrink-0"
            />
            <span className="text-sm text-muted-foreground leading-snug">
              I confirm this file is <strong className="text-foreground">not</strong> subject
              to ITAR or EAR export-license requirements. See{' '}
              <a
                href="/terms#acceptable-use"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service §4
              </a>{' '}
              for details.
            </span>
          </label>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!selectedFile || !selectedFoundryId || !itarConfirmed || isUploading}
            data-testid="button-run-check"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Preliminary Screen...
              </>
            ) : (
              <>Run Preliminary Screen</>
            )}
          </Button>
        </form>

        {recentRuns && recentRuns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Runs</CardTitle>
              <CardDescription>Your latest DRC check results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRuns.map((run) => (
                  <a
                    key={run.id}
                    href={`/results/${run.id}`}
                    className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    data-testid={`run-${run.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusBadge status={run.status} />
                          <p className="font-medium font-mono text-sm truncate">{run.filename}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{run.foundryName}</span>
                          <span>{new Date(run.checkedAt).toLocaleString()}</span>
                          <span>{run.processingTimeMs}ms</span>
                        </div>
                      </div>
                      {run.violationCount > 0 && (
                        <div className="text-right">
                          <p className="text-lg font-bold font-mono text-destructive">
                            {run.violationCount}
                          </p>
                          <p className="text-xs text-muted-foreground">violations</p>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
