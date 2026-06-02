interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="page-enter flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Animated spinner with gradient */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-400 animate-spin"></div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-center">{message}</p>
      </div>
    </div>
  );
}
