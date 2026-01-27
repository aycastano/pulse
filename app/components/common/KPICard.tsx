export function KPICard({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  trend?: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
