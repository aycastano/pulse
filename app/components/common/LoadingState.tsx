export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Cargando items...</p>
    </div>
  );
}
