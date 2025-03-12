import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
    <Card className="bg-white text-zinc-900 rounded-2xl border-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-lg md:text-xl font-medium text-zinc-800">
          {title}
        </h3>
        <span className="text-lg md:text-xl text-zinc-500 ml-10">{icon}</span>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-1">
          <p className="text-3xl md:text-5xl font-bold tracking-tighter text-zinc-900">
            {value}
          </p>
          <p className="text-xs md:text-sm text-zinc-600">
            <span
              className={
                change?.trend === 'down' ? 'text-red-600' : 'text-emerald-600'
              }
            >
              {change?.trend === 'up' ? '+' : '-'}
              {change?.value}
            </span>{' '}
            from last month
          </p>
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
    <Card className="bg-white text-zinc-900 rounded-2xl border-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-lg md:text-xl font-medium text-zinc-800">
          {title}
        </h3>
        <span className="text-lg md:text-xl text-zinc-500">{icon}</span>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-3">
          <Skeleton className="h-8 md:h-10 w-32 md:w-48 bg-zinc-200" />
          <Skeleton className="h-3 md:h-4 w-24 md:w-36 bg-zinc-200" />
        </div>
      </CardContent>
    </Card>
  );
}
