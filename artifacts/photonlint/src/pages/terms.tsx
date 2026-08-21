import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CONTACT_EMAIL = 'chance.x@gosale.cloud';
const EFFECTIVE_DATE = 'August 10, 2026';

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => history.length > 1 ? history.back() : setLocation('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <span className="text-sm font-medium">Terms of Service</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">PhotonLint Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Effective date: {EFFECTIVE_DATE} · Version 1.0</p>
        </header>

        <section className="space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of PhotonLint ("the Service"),
            a pre-tape-out layout linting tool for silicon photonics designs. By creating an account or using
            the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
          </p>
        </section>

        <div className="space-y-8 text-sm leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. Nature of the Service — Not a Sign-Off Tool</h2>
            <p className="text-muted-foreground">
              PhotonLint is a <strong className="text-foreground">pre-submission screening and linting tool</strong>.
              It is designed to help designers identify potential issues in GDSII layout files before official
              foundry submission. It is <strong className="text-foreground">not</strong> a replacement for official
              Design Rule Check (DRC) sign-off conducted by or in partnership with a foundry.
            </p>
            <p className="text-muted-foreground">
              The rule sets included in PhotonLint are approximate, representative values intended to flag common
              classes of issues. They are not the official, NDA-gated PDK specifications published by any foundry.
              PhotonLint is not affiliated with, endorsed by, or authorized by GlobalFoundries, AIM Photonics, imec,
              Tower Semiconductor, or any other foundry or PDK provider.
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">You must not rely on PhotonLint results as the sole or final basis
              for tape-out submission decisions.</strong> Always verify your design against the official PDK documentation
              provided directly by your foundry under your applicable NDA or license agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">2. Eligibility and Accounts</h2>
            <p className="text-muted-foreground">
              The Service is currently in closed beta and available by invitation only. You must be at least 18 years
              old and have the legal authority to enter into these Terms on behalf of yourself and, where applicable,
              your organization. If you are accepting these Terms on behalf of an organization, you represent that you
              have authority to bind that organization.
            </p>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account credentials and for all activity
              that occurs under your account. Notify us immediately at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-foreground hover:text-primary">{CONTACT_EMAIL}</a>{' '}
              if you suspect unauthorized use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">3. Your Intellectual Property</h2>
            <p className="text-muted-foreground">
              PhotonLint claims no ownership rights over any layout files, design data, or intellectual property
              you upload or transmit through the Service. Your GDSII files and the designs they contain remain
              your exclusive property or the property of the party that licensed them to you.
            </p>
            <p className="text-muted-foreground">
              By uploading a file, you grant PhotonLint a limited, non-exclusive license to process that file solely
              for the purpose of generating your requested DRC report. This license terminates immediately upon
              completion of the check. We do not use your files to train machine learning models, share them
              with third parties, or analyze them for any purpose other than the checks you request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">4. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
              <li>Upload files that are controlled under the International Traffic in Arms Regulations (ITAR) or
                  that otherwise require a U.S. export license for cloud processing by a non-cleared service provider.</li>
              <li>Attempt to reverse-engineer, extract, or reproduce any proprietary foundry rule deck or PDK
                  specification through or from the Service.</li>
              <li>Use the Service in any way that violates applicable laws, regulations, or third-party rights.</li>
              <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Service or its infrastructure.</li>
              <li>Use automated scripts or bots to submit layouts at a rate that exceeds normal human use, unless
                  you are using the documented API with a valid API key.</li>
            </ul>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Export control notice:</strong> PhotonLint is hosted in the United
              States. If your layout files relate to items that may be subject to U.S. Export Administration Regulations
              (EAR), it is your sole responsibility to determine whether cloud processing is permissible before uploading.
              When in doubt, consult your export compliance officer or legal counsel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">5. No Warranty</h2>
            <p className="text-muted-foreground">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              NON-INFRINGEMENT, OR ACCURACY. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, THAT ALL
              DESIGN RULE VIOLATIONS WILL BE DETECTED, OR THAT RESULTS WILL BE COMPLETE OR CORRECT.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, PHOTONLINT AND ITS OPERATORS SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT
              NOT LIMITED TO TAPE-OUT FAILURES, RE-SPIN COSTS, MASK COSTS, WAFER RUN COSTS, LOST REVENUE,
              LOST PROFITS, OR MISSED BUSINESS OPPORTUNITIES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="text-muted-foreground">
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE
              EXCEED THE GREATER OF (A) THE TOTAL AMOUNT YOU PAID FOR THE SERVICE IN THE TWELVE MONTHS PRECEDING
              THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).
            </p>
            <p className="text-muted-foreground">
              YOUR SOLE AND EXCLUSIVE REMEDY FOR DISSATISFACTION WITH THE SERVICE IS TO STOP USING IT.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">7. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless PhotonLint and its operators from and against any
              claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of
              or in connection with: (a) your use of the Service; (b) your violation of these Terms; (c) any layout
              files you upload that infringe third-party intellectual property rights or violate applicable export
              control or other laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">8. Changes to the Service and Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue the Service (or any part of it) at any time
              with or without notice. We may update these Terms from time to time. Continued use of the Service
              after changes become effective constitutes acceptance of the revised Terms. Material changes will
              be communicated via the email address associated with your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">9. Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your access to the Service at any time for any reason, including
              violation of these Terms. You may stop using the Service at any time and request account deletion
              by emailing{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-foreground hover:text-primary">{CONTACT_EMAIL}</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">10. Governing Law and Disputes</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of the State of Delaware, United States, without regard to
              conflict-of-law principles. Any dispute arising under these Terms shall be resolved exclusively
              in the state or federal courts located in Delaware. You waive any objection to jurisdiction or
              venue in those courts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">11. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these Terms? Email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline text-foreground hover:text-primary">{CONTACT_EMAIL}</a>.
            </p>
          </section>

        </div>

        <footer className="pt-6 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>PhotonLint Beta Terms of Service · Version 1.0 · Effective {EFFECTIVE_DATE}</p>
          <p>
            See also our{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setLocation('/privacy'); }}
              className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
