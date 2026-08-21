import { Link, useRoute } from 'wouter';
import { Upload, History, BarChart3, FileCheck2, LogOut, Settings } from 'lucide-react';
import { useUser, useClerk } from '@clerk/react';
import { cn } from '@/lib/utils';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isHome] = useRoute('/');
  const [isHistory] = useRoute('/history');
  const [isStats] = useRoute('/stats');
  const [isSettings] = useRoute('/settings');

  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName =
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ??
    'User';
  const email = user?.primaryEmailAddress?.emailAddress;

  const links = [
    { href: '/', label: 'Upload', icon: Upload, active: isHome },
    { href: '/history', label: 'History', icon: History, active: isHistory },
    { href: '/stats', label: 'Statistics', icon: BarChart3, active: isStats },
    { href: '/settings', label: 'Settings', icon: Settings, active: isSettings },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight text-sidebar-foreground">
              PhotonLint
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            Design Rule Checker
          </p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      link.active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {user && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {displayName}
                </p>
                {email && (
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                )}
              </div>
              <button
                onClick={() => signOut({ redirectUrl: basePath || '/' })}
                className="shrink-0 p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors"
                title="Sign out"
                data-testid="button-sign-out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground font-mono">
            Silicon Photonics DRC
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
