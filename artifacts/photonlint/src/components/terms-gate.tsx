import { useState, useEffect, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TermsGateProps {
  children: ReactNode;
}

const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

/** Single source of truth for the beta contact / data-deletion address. */
const CONTACT_EMAIL = 'chance.x@gosale.cloud';

async function fetchTermsStatus(signal?: AbortSignal): Promise<boolean> {
  const res = await fetch(`${BASE}/api/terms/status`, { credentials: 'include', signal });
  if (!res.ok) throw new Error(`Terms status check failed: ${res.status}`);
  const data = await res.json() as { accepted?: unknown };
  // Runtime guard: accepted must be a boolean — treat anything else as not-yet-accepted.
  return data.accepted === true;
}

async function postAccept(): Promise<void> {
  const res = await fetch(`${BASE}/api/terms/accept`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Failed to record acceptance: ${res.status}`);
}

/**
 * Shows a full-page terms-of-use screen after Clerk login.
 * Records acceptance in the database tied to the user's Clerk ID.
 * Renders children only after the user has accepted the current version.
 */
export function TermsGate({ children }: TermsGateProps) {
  const [status, setStatus] = useState<'loading' | 'accepted' | 'pending' | 'error'>('loading');
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchTermsStatus(controller.signal)
      .then((accepted) => setStatus(accepted ? 'accepted' : 'pending'))
      .catch((err: unknown) => {
        // Ignore aborts from component unmount — only set error for real failures.
        if (err instanceof Error && err.name !== 'AbortError') setStatus('error');
      });
    return () => controller.abort();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background p-8">
        <div className="text-center space-y-3">
          <p className="text-destructive font-medium">Unable to load terms of use.</p>
          <p className="text-sm text-muted-foreground">Please refresh the page to try again.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  if (status === 'accepted') {
    return <>{children}</>;
  }

  // ── Terms screen ─────────────────────────────────────────────────────────────
  async function handleAccept() {
    if (!checked) return;
    setSubmitting(true);
    setAcceptError(null);
    try {
      await postAccept();
      setStatus('accepted');
    } catch {
      setSubmitting(false);
      setAcceptError('Something went wrong — please try again.');
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl space-y-8">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Beta Terms of Use</h1>
          <p className="text-sm text-muted-foreground">
            Please read and accept before using PhotonLint. Version 1.0 · {new Date().getFullYear()}
          </p>
        </div>

        {/* Terms body */}
        <div className="bg-card border border-card-border rounded-xl divide-y divide-border text-sm leading-relaxed">

          <section className="p-6 space-y-2">
            <h2 className="font-semibold text-base">1. Your Intellectual Property</h2>
            <p className="text-muted-foreground">
              PhotonLint claims no rights to any layout files you upload. Your GDSII files and
              the designs they contain remain your exclusive property. Uploaded files are
              processed transiently to generate your DRC report and are not retained on our
              servers beyond the duration of the check. We do not use your files to train models,
              share them with third parties, or analyse them for any purpose other than running
              the design rule checks you requested.
            </p>
          </section>

          <section className="p-6 space-y-2">
            <h2 className="font-semibold text-base">2. Accuracy of Results — Not for Tape-Out Sign-Off</h2>
            <p className="text-muted-foreground">
              The foundry rule sets included in PhotonLint (GlobalFoundries 45SPCLO, AIM Photonics,
              imec iSiPP50G, Tower Semiconductor) are <strong className="text-foreground">approximate
              representative values</strong>. They are not the official, NDA-gated PDK specifications
              published by those foundries. PhotonLint is not affiliated with or endorsed by any of
              those foundries.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">PhotonLint results must not be used as the basis for
              tape-out sign-off decisions.</strong> Always verify final designs against the official PDK
              documentation provided directly by your foundry under your NDA.
            </p>
          </section>

          <section className="p-6 space-y-2">
            <h2 className="font-semibold text-base">3. No Warranty — Limitation of Liability</h2>
            <p className="text-muted-foreground">
              PhotonLint is provided <strong className="text-foreground">"as is,"</strong> without
              warranty of any kind, express or implied. We make no representations about the
              completeness, reliability, or fitness of the tool for any particular purpose.
            </p>
            <p className="text-muted-foreground">
              To the fullest extent permitted by applicable law, PhotonLint and its operators shall
              not be liable for any direct, indirect, incidental, or consequential damages arising
              from your use of this service — including but not limited to tape-out failures,
              re-spin costs, or lost business — even if advised of the possibility of such damages.
              Your sole remedy for dissatisfaction is to stop using the service.
            </p>
          </section>

          <section className="p-6 space-y-2">
            <h2 className="font-semibold text-base">4. Hosting & Data Residency</h2>
            <p className="text-muted-foreground">
              PhotonLint is hosted on Replit's cloud infrastructure, which operates from data
              centres located in the United States. Uploaded files and DRC results are processed
              and stored exclusively within that infrastructure. No uploaded file or derived result
              is transferred to servers outside the United States.
            </p>
          </section>

          <section className="p-6 space-y-2">
            <h2 className="font-semibold text-base">5. Beta Programme & Data</h2>
            <p className="text-muted-foreground">
              You are accessing PhotonLint as an invited beta tester. We collect your email address
              to manage your account and may contact you about the product. DRC run results
              (violation counts, processing times, and anonymised statistics) may be retained to
              improve the service. You can request deletion of your account data at any time by
              emailing{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline text-foreground hover:text-primary transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the State of Delaware, United States.
              By accepting, you confirm you have the authority to agree on behalf of yourself and,
              where applicable, your organisation.
            </p>
          </section>
        </div>

        {/* Accept row */}
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
              className="mt-0.5 shrink-0"
              id="terms-checkbox"
            />
            <span className="text-sm text-foreground leading-snug">
              I have read and agree to the PhotonLint{' '}
              <a href={`${BASE}/terms`} target="_blank" rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href={`${BASE}/privacy`} target="_blank" rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors">
                Privacy Policy
              </a>
              . I understand that results are not certified for tape-out, my uploaded
              files are processed in the US and will not be retained or shared.
            </span>
          </label>

          <Button
            className="w-full"
            disabled={!checked || submitting}
            onClick={handleAccept}
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Recording acceptance…</>
            ) : (
              'Accept and Continue'
            )}
          </Button>

          {acceptError && (
            <p className="text-sm text-destructive text-center">{acceptError}</p>
          )}
        </div>

      </div>
    </div>
  );
}
