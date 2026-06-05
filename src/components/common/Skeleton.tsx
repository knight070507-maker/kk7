export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
      <div className="flex gap-2 mb-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <div className="flex gap-3"><Skeleton className="h-3 w-12" /><Skeleton className="h-3 w-12" /><Skeleton className="h-3 w-12" /></div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto p-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
