interface SmoothLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function SmoothLoader({ message = 'Loading...', fullScreen = false }: SmoothLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 spinner-smooth"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-blue-300 rounded-full animate-pulse"></div>
      </div>
      
      {/* Loading text with animation */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">{message}</p>
        <div className="flex gap-1 justify-center mt-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="page-enter fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary">
        {content}
      </div>
    );
  }

  return (
    <div className="page-enter flex items-center justify-center h-screen bg-gradient-to-br from-background via-background to-secondary">
      {content}
    </div>
  );
}
