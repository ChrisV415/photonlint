import { useEffect, useRef, type ReactNode } from 'react';
import { ClerkProvider, useAuth, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, Redirect, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Home from '@/pages/home';
import TermsOfService from '@/pages/terms';
import PrivacyPolicy from '@/pages/privacy';
import Results from '@/pages/results';
import History from '@/pages/history';
import Stats from '@/pages/stats';
import Settings from '@/pages/settings';
import SignInPage from '@/pages/sign-in';
import SignUpPage from '@/pages/sign-up';
import NotFound from '@/pages/not-found';
import { TermsGate } from '@/components/terms-gate';

const queryClient = new QueryClient();

// REQUIRED — resolves the publishable key from the request hostname so the
// same build works across dev, staging, and custom domains. Do not inline
// the env var or replace publishableKeyFromHost with anything else.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — empty in dev (intentional), auto-set in prod. Do NOT gate on
// import.meta.env.PROD / NODE_ENV — any branching breaks the prod proxy.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

// Clerk passes full paths to routerPush/routerReplace; wouter's setLocation
// prepends the base automatically, so we strip it to avoid doubling.
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY — ensure the secret is set in the workspace.');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: 'hsl(192, 85%, 48%)',
    colorForeground: 'hsl(217, 25%, 12%)',
    colorMutedForeground: 'hsl(217, 12%, 42%)',
    colorDanger: 'hsl(0, 72%, 51%)',
    colorBackground: 'hsl(215, 25%, 97%)',
    colorInput: 'hsl(217, 15%, 88%)',
    colorInputForeground: 'hsl(217, 25%, 12%)',
    colorNeutral: 'hsl(217, 15%, 88%)',
    fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
    borderRadius: '0.375rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-md',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-semibold',
    headerSubtitle: 'text-[hsl(217,12%,42%)]',
    socialButtonsBlockButtonText: 'text-[hsl(217,25%,12%)]',
    formFieldLabel: 'text-[hsl(217,25%,12%)]',
    footerActionLink: 'text-[hsl(192,85%,48%)]',
    footerActionText: 'text-[hsl(217,12%,42%)]',
    dividerText: 'text-[hsl(217,12%,42%)]',
    identityPreviewEditButton: 'text-[hsl(192,85%,48%)]',
    formFieldSuccessText: 'text-green-600',
    alertText: 'text-[hsl(217,25%,12%)]',
    logoBox: 'mb-1',
    logoImage: 'w-10 h-10',
    socialButtonsBlockButton: 'border border-[hsl(217,15%,88%)]',
    formButtonPrimary: 'bg-[hsl(192,85%,48%)] hover:bg-[hsl(192,85%,40%)]',
    formFieldInput: 'border-[hsl(217,15%,88%)]',
    footerAction: 'bg-[hsl(215,25%,95%)]',
    dividerLine: 'bg-[hsl(217,15%,88%)]',
    alert: 'border border-[hsl(217,15%,88%)]',
    otpCodeFieldInput: 'border-[hsl(217,15%,88%)]',
    formFieldRow: '',
    main: '',
  },
};

function PageLoader() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );
}

// Shown at "/" for users who are not signed in.
// Must be a real landing page — never redirect signed-out users to /sign-in.
function LandingPage() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={`${basePath}/logo.svg`} alt="PhotonLint logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-tight">PhotonLint</h1>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Design Rule Checker for Silicon Photonics. Upload a GDSII file and get instant feedback against foundry PDK rules.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => setLocation('/sign-in')}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
          <button
            onClick={() => setLocation('/sign-up')}
            className="px-5 py-2.5 rounded-md border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
          >
            Create account
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Beta · By invitation only</p>
        <div className="flex gap-4 justify-center pt-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setLocation('/terms'); }}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setLocation('/privacy'); }}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

// Protects routes that require authentication + terms acceptance.
// Redirects to /sign-in if not authenticated; shows TermsGate if terms not yet accepted.
function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <PageLoader />;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <TermsGate>{children}</TermsGate>;
}

// "/" shows the upload interface for signed-in users (behind terms gate),
// and the public landing page for signed-out users.
function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <PageLoader />;
  if (isSignedIn) return <TermsGate><Home /></TermsGate>;
  return <LandingPage />;
}

// Clears the React Query cache whenever the signed-in user changes, preventing
// stale data from one session appearing in another.
function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

// Protected page wrappers — inline to keep the Switch readable
const ProtectedResults  = () => <AuthGuard><Results /></AuthGuard>;
const ProtectedHistory  = () => <AuthGuard><History /></AuthGuard>;
const ProtectedStats    = () => <AuthGuard><Stats /></AuthGuard>;
const ProtectedSettings = () => <AuthGuard><Settings /></AuthGuard>;

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to your PhotonLint account',
          },
        },
        signUp: {
          start: {
            title: 'Create your account',
            subtitle: 'Get started with PhotonLint',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/results/:id" component={ProtectedResults} />
            <Route path="/history" component={ProtectedHistory} />
            <Route path="/stats" component={ProtectedStats} />
            <Route path="/settings" component={ProtectedSettings} />
            <Route path="/terms" component={TermsOfService} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
