import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CONTACT_EMAIL = 'chance.x@gosale.cloud';
const EFFECTIVE_DATE = 'August 10, 2026';

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => history.length > 1 ? history.back() : setLocation('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <span className="text-sm font-medium">Privacy Policy</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">PhotonLint Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Effective date: {EFFECTIVE_DATE} · Version 1.0</p>
        </header>

        <section className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy explains what data PhotonLint collects, how it is used, and your rights
            regarding that data. We have designed PhotonLint with IP sensitivity in mind: your layout
            files are not stored after your check completes, and we do not use your data to train
            machine learning models.
          </p>
        </section>

        <div className="space-y-8 text-sm leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. What We Collect</h2>

            <h3 className="font-medium text-foreground">Account information</h3>
            <p className="text-muted-foreground">
              When you create an account, we collect your email address and, if you sign in with Google,
              your name and profile picture as provided by Google. Authentication is handled by Clerk
              (clerk.com). We do not store your password — Clerk manages credentials on our behalf.
            </p>

            <h3 className="font-medium text-foreground">Layout files (GDSII)</h3>
            <p className="text-muted-foreground">
              Files you upload are processed in memory to generate your DRC report. <strong className="text-foreground">
              Raw layout files are not written to persistent storage.</strong> Once the check completes,
              the file is discarded. We do not retain, copy, analyze, or share your layout files for
              any purpose other than running the checks you requested.
            </p>

            <h3 className="font-medium text-foreground">DRC run metadata</h3>
            <p className="text-muted-foreground">
              We store a record of each DRC run associated with your account, including: the foundry/PDK
              selected, the filename you provided, violation counts by severity and rule, processing time,
              and the full structured results (violation locations, rule names, severity levels). This is
              the data shown in your History tab and used to generate PDF reports.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">This metadata does not include the raw polygon geometry
              from your layout file</strong> — it includes only the violation coordinates and rule names
              that the DRC engine extracted.
            </p>

            <h3 className="font-medium text-foreground">Usage and logs</h3>
            <p className="text-muted-foreground">
              We collect standard server logs (request timestamps, response codes, error rates) for
              operational purposes. These logs are retained for up to 30 days and are not linked to
              your account or layout content.
            </p>

            <h3 className="font-medium text-foreground">API keys</h3>
            <p className="text-muted-foreground">
              If you generate API keys (for CI integration), we store a hashed version of the key and
              the label you provide. The plaintext key is shown only once at creation and is not recoverable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">2. How We Use Your Data</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
              <li>To authenticate you and manage your account.</li>
              <li>To run the DRC checks you request and return results to you.</li>
              <li>To store your run history so you can review past results.</li>
              <li>To generate PDF and CSV exports on your request.</li>
              <li>To contact you about the PhotonLint beta programme — product updates, known issues,
                  and requests for feedback.</li>
              <li>To monitor service health and diagnose errors.</li>
            </ul>
            <p className="text-muted-foreground">
              <strong className="text-foreground">We do not:</strong> sell your data, share it with third
              parties for marketing, use your layout files or DRC results to train machine learning models,
              or share your data with foundries or PDK providers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">3. Third-Party Services</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                <strong className="text-foreground">Clerk</strong> — handles authentication (sign-in,
                sign-up, session management). Clerk processes your email address and, if you use Google
                sign-in, your Google profile data. Clerk's privacy policy applies to data they process:
                {' '}<a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors">clerk.com/privacy</a>.
              </p>
              <p>
                <strong className="text-foreground">Replit</strong> — our hosting infrastructure.
                All data is processed and stored on Replit's servers, located in the United States.
                Replit's privacy policy applies to infrastructure-level processing:
                {' '}<a href="https://replit.com/site/privacy" target="_blank" rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors">replit.com/site/privacy</a>.
              </p>
            </div>
            <p className="text-muted-foreground">
              No other third parties have access to your account data or DRC results.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">4. Data Residency</h2>
            <p className="text-muted-foreground">
              All data — including account information, run metadata, and any transient file processing —
              takes place on servers located in the United States. If you are located outside the United
              States, you consent to your data being transferred to and processed in the United States.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">5. Data Retention</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium text-foreground">Data type</th>
                    <th className="text-left py-2 font-medium text-foreground">Retention</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground divide-y divide-border">
                  <tr><td className="py-2 pr-4">Uploaded layout files (GDSII)</td><td className="py-2">Deleted immediately after check completes</td></tr>
                  <tr><td className="py-2 pr-4">DRC run results and metadata</td><td className="py-2">Retained until you delete your account</td></tr>
                  <tr><td className="py-2 pr-4">Account information (email, name)</td><td className="py-2">Retained until you delete your account</td></tr>
                  <tr><td className="py-2 pr-4">Server logs</td><td className="py-2">Up to 30 days, then purged</td></tr>
                  <tr><td className="py-2 pr-4">API keys (hashed)</td><td className="py-2">Until you revoke them or delete your account</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">You may at any time:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
              <li><strong className="text-foreground">Access</strong> the data we hold about you by
                  reviewing your History and Settings pages, or by contacting us.</li>
              <li><strong className="text-foreground">Delete</strong> individual DRC runs from your History tab.</li>
              <li><strong className="text-foreground">Request full account deletion</strong> — all run history,
                  metadata, and account information — by emailing{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-foreground transition-colors">
                    {CONTACT_EMAIL}
                  </a>. We will process deletion within 14 business days.</li>
              <li><strong className="text-foreground">Opt out</strong> of beta programme emails by replying
                  "unsubscribe" to any email we send, or by contacting us directly.</li>
            </ul>
            <p className="text-muted-foreground">
              If you are in the European Economic Area or United Kingdom, you may also have rights under
              GDPR/UK GDPR including rectification, restriction of processing, and data portability.
              Contact us at the address below to exercise those rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">7. Security</h2>
            <p className="text-muted-foreground">
              Data is transmitted over TLS. Database records are stored in a managed PostgreSQL instance
              with access restricted to the API server. API keys are stored as hashed values — we cannot
              recover your plaintext key. We do not store raw layout file data at rest.
            </p>
            <p className="text-muted-foreground">
              No system is perfectly secure. If you believe a security issue exists, please report it
              responsibly to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-foreground transition-colors">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">8. Children</h2>
            <p className="text-muted-foreground">
              PhotonLint is not directed at children under 18. We do not knowingly collect personal data
              from anyone under 18. If you believe a minor has created an account, contact us and we will
              delete it promptly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Material changes will be communicated
              via email to the address associated with your account at least 7 days before they take effect.
              Continued use of the Service after that date constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">10. Contact</h2>
            <p className="text-muted-foreground">
              Questions, requests, or concerns about this Privacy Policy:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-foreground hover:text-primary">{CONTACT_EMAIL}</a>
            </p>
          </section>

        </div>

        <footer className="pt-6 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>PhotonLint Privacy Policy · Version 1.0 · Effective {EFFECTIVE_DATE}</p>
          <p>
            See also our{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setLocation('/terms'); }}
              className="underline hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
