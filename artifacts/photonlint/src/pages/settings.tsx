import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Plus, Trash2, Copy, Check, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

interface ApiKey {
  id: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
}

async function fetchKeys(): Promise<ApiKey[]> {
  const res = await fetch(`${BASE}/api/api-keys`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load API keys');
  const data = await res.json() as { keys?: unknown };
  // Guard: server should always return an array, but validate before callers
  // call .map()/.length on the result — a null or missing `keys` would crash.
  return Array.isArray(data.keys) ? (data.keys as ApiKey[]) : [];
}

async function createKey(label: string): Promise<{ key: string; id: string; label: string; createdAt: string }> {
  const res = await fetch(`${BASE}/api/api-keys`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? 'Failed to create API key');
  }
  return res.json();
}

async function revokeKey(id: string): Promise<void> {
  const res = await fetch(`${BASE}/api/api-keys/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to revoke API key');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied in some browser/OS configurations.
      // Fall back to a visible selection so the user can copy manually.
      const el = document.querySelector<HTMLElement>('[data-copy-target]');
      if (el) { window.getSelection()?.selectAllChildren(el); }
    }
  }
  return (
    <button
      onClick={handleCopy}
      className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function Settings() {
  const qc = useQueryClient();
  const { toast } = useToast();

  // ── API key list ────────────────────────────────────────────────────────────
  const { data: keys = [], isLoading, isError } = useQuery({
    queryKey: ['api-keys'],
    queryFn: fetchKeys,
  });

  // ── Create dialog ───────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createKey,
    onSuccess: (data) => {
      setNewKey(data.key);
      setLabel('');
      qc.invalidateQueries({ queryKey: ['api-keys'] });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  function handleCreateOpen() {
    setNewKey(null);
    setLabel('');
    setCreateOpen(true);
  }

  function handleCreateClose() {
    setCreateOpen(false);
    setNewKey(null);
    setLabel('');
  }

  // ── Revoke ──────────────────────────────────────────────────────────────────
  const [revoking, setRevoking] = useState<string | null>(null);

  async function handleRevoke(id: string) {
    setRevoking(id);
    try {
      await revokeKey(id);
      qc.invalidateQueries({ queryKey: ['api-keys'] });
      toast({ title: 'API key revoked' });
    } catch {
      toast({ title: 'Error', description: 'Failed to revoke key', variant: 'destructive' });
    } finally {
      setRevoking(null);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            API Keys
          </h1>
          <p className="text-sm text-muted-foreground">
            Use API keys to run DRC checks from CI pipelines and scripts without a browser session.
          </p>
        </div>

        {/* Key list */}
        <div className="border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : isError ? (
            <div className="p-8 text-center text-sm text-destructive">Failed to load API keys. Refresh to try again.</div>
          ) : keys.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm text-muted-foreground">No API keys yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {keys.map((k) => (
                <li key={k.id} className="flex items-center justify-between px-4 py-3 gap-4">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium truncate">{k.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(k.createdAt)}
                      {k.lastUsedAt ? ` · Last used ${formatDate(k.lastUsedAt)}` : ' · Never used'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRevoke(k.id)}
                    disabled={revoking === k.id}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Revoke</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button onClick={handleCreateOpen} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Create API key
        </Button>

      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={(v) => { if (!v) handleCreateClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newKey ? 'Your new API key' : 'Create API key'}
            </DialogTitle>
          </DialogHeader>

          {newKey ? (
            <div className="space-y-4">
              {/* One-time reveal */}
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <code className="flex-1 text-xs font-mono break-all select-all">{newKey}</code>
                <CopyButton text={newKey} />
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Copy this key now — it won't be shown again. Store it in your repository secrets as{' '}
                  <code className="font-mono">PHOTONLINT_API_KEY</code>.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateClose} className="w-full">Done</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="key-label">Label</Label>
                <Input
                  id="key-label"
                  placeholder="e.g. GitHub Actions – silicon-photonics"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && label.trim() && !createMutation.isPending) {
                      createMutation.mutate(label.trim());
                    }
                  }}
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCreateClose}>Cancel</Button>
                <Button
                  onClick={() => createMutation.mutate(label.trim())}
                  disabled={!label.trim() || createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating…' : 'Create key'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
