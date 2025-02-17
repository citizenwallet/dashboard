import { Card, CardContent } from '@/components/ui/card';

export interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
}

export function MetricCard({ icon, title, value, change }: MetricCardProps) {
  return (
    <Card className="w-full max-w-[400px]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-lg bg-slate-100 p-3">{icon}</div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-semibold tracking-tight">{value}</h3>
              {change && (
                <div
                  className={`flex items-center rounded-full px-2 py-1 text-sm ${
                    change.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {change.trend === 'up' ? '↑' : '↓'}{' '}
                  {Math.abs(change.value).toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricCardSkeleton({
  icon,
  title
}: Pick<MetricCardProps, 'icon' | 'title'>) {
  return (
    <Card className="w-full max-w-[400px]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-lg bg-slate-100 p-3">{icon}</div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <div className="flex items-center justify-between">
              <div className="h-9 w-24 rounded-lg bg-slate-100 animate-pulse" />
              <div className="h-7 w-20 rounded-full bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
