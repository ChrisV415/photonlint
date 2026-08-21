import { useParams, useLocation } from 'wouter';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useGetDrcRun } from '@workspace/api-client-react';
import { Layout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { Download, FileText, MapPin, ArrowLeft, ArrowUpDown, Layers, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DrcViolation, LayoutData } from '@workspace/api-client-react';
import { LayoutViewer } from '@/components/layout-viewer';
import { useToast } from '@/hooks/use-toast';

type SortField = 'severity' | 'rule' | 'location';
type SortOrder = 'asc' | 'desc';

const SEVERITY_ORDER: Record<string, number> = { critical: 0, warning: 1, info: 2 };

export default function Results() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [sortField, setSortField] = useState<SortField>('severity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedViolationIdx, setSelectedViolationIdx] = useState<number | null>(null);
  const violationRowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const { data: result, isLoading } = useGetDrcRun(params.id ?? '');

  // Sorted violations carry their original index so the viewer and table stay in sync.
  const sortedViolations = useMemo(() => {
    // Use Array.isArray — a truthy non-array (e.g. object) would crash .map()
    if (!Array.isArray(result?.violations)) return [];
    return result.violations
      .map((v, originalIdx) => ({ ...v, originalIdx }))
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'severity') {
          cmp = (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9);
        } else if (sortField === 'rule') {
          cmp = a.rule.localeCompare(b.rule);
        } else {
          cmp = a.location.localeCompare(b.location);
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [result?.violations, sortField, sortOrder]);

  // When a violation is selected, scroll its table row into view
  useEffect(() => {
    if (selectedViolationIdx === null) return;
    violationRowRefs.current[selectedViolationIdx]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedViolationIdx]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const downloadCSV = () => {
    if (!result) return;
    const headers = ['Rule', 'Severity', 'Requirement', 'Location', 'Details'];
    const rows = sortedViolations.map((v) => [v.rule, v.severity, v.requirement, v.location, v.details]);
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.filename}-violations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { toast } = useToast();

  const downloadLyrdb = async () => {
    if (!result) return;
    const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    try {
      const res = await fetch(`${BASE}/api/drc/runs/${result.id}/report.lyrdb`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast({
          title: 'KLayout export failed',
          description: body.error ?? `Server returned ${res.status}. Please try again.`,
          variant: 'destructive',
        });
        return;
      }
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = `photonlint_${result.filename.replace(/\.gds(ii)?$/i, '')}.lyrdb`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'KLayout export failed', description: 'Network error — please check your connection and try again.', variant: 'destructive' });
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    try {
      const res = await fetch(`${BASE}/api/drc/runs/${result.id}/report.pdf`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast({
          title: 'PDF generation failed',
          description: body.error ?? `Server returned ${res.status}. Please try again.`,
          variant: 'destructive',
        });
        return;
      }
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = `photonlint_${result.filename.replace(/\.gds(ii)?$/i, '')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'PDF generation failed', description: 'Network error — please check your connection and try again.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto p-8 flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto p-8">
          <div className="text-center py-12 space-y-4">
            <p className="text-lg text-muted-foreground">Result not found.</p>
            <Button onClick={() => setLocation('/')}>Return to Upload</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const layoutData = result.layoutData as LayoutData | null | undefined;
  // Guard: bounds must exist AND contain finite numbers before passing to LayoutViewer.
  // NaN/Infinity coordinates (e.g. from degenerate geometry) would silently corrupt SVG rendering.
  const hasLayoutPreview = !!(
    layoutData &&
    layoutData.bounds &&
    Number.isFinite(layoutData.bounds.minX) &&
    Number.isFinite(layoutData.bounds.minY) &&
    Number.isFinite(layoutData.bounds.maxX) &&
    Number.isFinite(layoutData.bounds.maxY)
  );
  const safeViolations = Array.isArray(result.violations) ? result.violations : [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/history')} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
        </div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-mono">{result.filename}</h1>
            <p className="text-muted-foreground mt-1">
              {result.foundryName} — {new Date(result.checkedAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={result.status} className="text-base px-4 py-2" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3"><CardDescription>Total Checks</CardDescription></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono" data-testid="text-total-checks">
                {result.totalChecks}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription>Passed</CardDescription></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono text-green-600" data-testid="text-passed-checks">
                {result.passedChecks}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription>Violations</CardDescription></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono text-destructive" data-testid="text-violation-count">
                {result.violationCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription>Processing Time</CardDescription></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono" data-testid="text-processing-time">
                {result.processingTimeMs}
                <span className="text-base text-muted-foreground ml-1">ms</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {result.status === 'error' && result.errorMessage && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Processing Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono">{result.errorMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* ── Layout Preview + Violations side-by-side ── */}
        {hasLayoutPreview && (
          <div className={`grid gap-6 ${(result.violations ?? []).length > 0 ? 'grid-cols-[1fr_1fr]' : 'grid-cols-1'}`}>
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base">Layout Preview</CardTitle>
                </div>
                <CardDescription>
                  {(layoutData!.polygons?.length ?? 0).toLocaleString()} polygon
                  {(layoutData!.polygons?.length ?? 0) !== 1 ? 's' : ''} across{' '}
                  {Array.from(new Set((layoutData!.polygons ?? []).map((p) => p.layer))).length} layer
                  {Array.from(new Set((layoutData!.polygons ?? []).map((p) => p.layer))).length !== 1 ? 's' : ''}
                  {(layoutData!.configuredLayers?.length ?? 0) > 0 && (
                    <> · <span className="text-teal-600 dark:text-teal-400 font-medium">
                      {layoutData!.configuredLayers!.length} PDK-checked
                      {' '}({layoutData!.configuredLayers!.map((l) => l.name).join(', ')})
                    </span></>
                  )}
                  {(result.violations ?? []).some((v) => v.geometry) && (
                    <> · click a violation to highlight it</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[420px]">
                <LayoutViewer
                  layoutData={layoutData!}
                  violations={safeViolations as DrcViolation[]}
                  selectedViolationIdx={selectedViolationIdx}
                  onSelectViolation={(idx) =>
                    setSelectedViolationIdx(idx === selectedViolationIdx ? null : idx)
                  }
                />
              </CardContent>
            </Card>

            {safeViolations.length > 0 && (
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="pb-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Violations</CardTitle>
                      <CardDescription>{result.violationCount} design rule violation(s) found</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={downloadCSV} variant="outline" size="sm" data-testid="button-download-csv">
                        <Download className="w-4 h-4 mr-2" />CSV
                      </Button>
                      <Button onClick={downloadPDF} variant="outline" size="sm" data-testid="button-download-pdf">
                        <FileText className="w-4 h-4 mr-2" />PDF
                      </Button>
                      <Button onClick={downloadLyrdb} variant="outline" size="sm" data-testid="button-download-lyrdb" title="Open in KLayout via Tools → Marker Browser → Load">
                        <MapPin className="w-4 h-4 mr-2" />KLayout
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead className="w-28 pl-4">
                          <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 font-semibold hover:text-foreground" data-testid="sort-severity">
                            Severity <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button onClick={() => toggleSort('rule')} className="flex items-center gap-1 font-semibold hover:text-foreground" data-testid="sort-rule">
                            Rule <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead>
                          <button onClick={() => toggleSort('location')} className="flex items-center gap-1 font-semibold hover:text-foreground" data-testid="sort-location">
                            Location <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedViolations.map((violation) => {
                        const oi = violation.originalIdx;
                        const isSelected = oi === selectedViolationIdx;
                        const hasGeometry = !!violation.geometry;
                        return (
                          <TableRow
                            key={oi}
                            ref={(el) => { violationRowRefs.current[oi] = el; }}
                            data-testid={`violation-${oi}`}
                            className={`transition-colors ${hasGeometry ? 'cursor-pointer' : ''} ${isSelected ? 'bg-accent' : hasGeometry ? 'hover:bg-muted/60' : ''}`}
                            onClick={() => { if (hasGeometry) setSelectedViolationIdx(isSelected ? null : oi); }}
                            title={violation.details}
                          >
                            <TableCell className="pl-4">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold font-mono uppercase ${
                                violation.severity === 'critical' ? 'bg-red-500/10 text-red-700 border border-red-500/20'
                                : violation.severity === 'warning' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                              }`}>{violation.severity}</span>
                            </TableCell>
                            <TableCell className="font-mono text-sm font-medium">{violation.rule}</TableCell>
                            <TableCell className="font-mono text-sm">{violation.requirement}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground max-w-[180px] truncate">{violation.location}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Full violation details table (no layout preview) ── */}
        {safeViolations.length > 0 && !hasLayoutPreview && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Violations</CardTitle>
                  <CardDescription>{result.violationCount} design rule violation(s) found</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={downloadCSV} variant="outline" size="sm" data-testid="button-download-csv">
                    <Download className="w-4 h-4 mr-2" />CSV
                  </Button>
                  <Button onClick={downloadPDF} variant="outline" size="sm" data-testid="button-download-pdf">
                    <FileText className="w-4 h-4 mr-2" />PDF Report
                  </Button>
                  <Button onClick={downloadLyrdb} variant="outline" size="sm" data-testid="button-download-lyrdb" title="Open in KLayout via Tools → Marker Browser → Load">
                    <MapPin className="w-4 h-4 mr-2" />KLayout
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">
                      <button onClick={() => toggleSort('severity')} className="flex items-center gap-1 font-semibold hover:text-foreground" data-testid="sort-severity">
                        Severity <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort('rule')} className="flex items-center gap-1 font-semibold hover:text-foreground" data-testid="sort-rule">
                        Rule <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead>Requirement</TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort('location')} className="flex items-center gap-1 font-semibold hover:text-foreground" data-testid="sort-location">
                        Location <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedViolations.map((v, idx) => (
                    <TableRow key={idx} data-testid={`violation-${idx}`}>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold font-mono uppercase ${
                          v.severity === 'critical' ? 'bg-red-500/10 text-red-700 border border-red-500/20'
                          : v.severity === 'warning' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                        }`}>{v.severity}</span>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">{v.rule}</TableCell>
                      <TableCell className="font-mono text-sm">{v.requirement}</TableCell>
                      <TableCell className="font-mono text-sm">{v.location}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">{v.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {result.status === 'pass' && safeViolations.length === 0 && (
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="pt-6 text-center py-12 space-y-4">
              <p className="text-lg font-semibold text-green-700">All design rules passed</p>
              <p className="text-sm text-muted-foreground">
                Layout meets all {result.foundryName} PDK requirements
              </p>
              <Button onClick={downloadPDF} variant="outline" size="sm" data-testid="button-download-pdf-pass">
                <FileText className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
