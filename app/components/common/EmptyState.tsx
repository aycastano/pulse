import { Search } from "lucide-react";
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No se encontraron resultados
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Intenta ajustar los filtros de búsqueda
      </p>
    </div>
  );
}
