import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className: string;
}> = {
  pass: {
    icon: CheckCircle2,
    label: 'PASS',
    className: 'bg-green-500/10 text-green-700 border-green-500/20',
  },
  fail: {
    icon: XCircle,
    label: 'FAIL',
    className: 'bg-red-500/10 text-red-700 border-red-500/20',
  },
  error: {
    icon: AlertCircle,
    label: 'ERROR',
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  },
};

const UNKNOWN_CONFIG = {
  icon: HelpCircle,
  label: 'UNKNOWN',
  className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { icon: Icon, label, className: statusClass } = STATUS_CONFIG[status] ?? UNKNOWN_CONFIG;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold font-mono tracking-wide',
        statusClass,
        className
      )}
      data-testid={`status-${status}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
