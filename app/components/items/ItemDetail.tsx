import React from "react";
import { PulseItem, Status, Priority } from "../../domain/types";
import { X, User, Calendar, Tag, History } from "lucide-react";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../../domain/constants";
import { calculateScore } from "../../domain/score";
export function ItemDetail({
  item,
  onClose,
  onUpdate,
}: {
  item: PulseItem;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<PulseItem>) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {item.id}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h3>
            <p className="text-gray-900 dark:text-white">{item.description}</p>
          </div>

          {/* Status & Priority Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <select
                value={item.status}
                onChange={(e) =>
                  onUpdate(item.id, { status: e.target.value as Status })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={item.priority}
                onChange={(e) =>
                  onUpdate(item.id, { priority: e.target.value as Priority })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Score
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {calculateScore(item)}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Impact
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {item.impact}/5
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Effort
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {item.effort}/5
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            {item.owner && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.owner}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Created:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tags:
              </span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* History */}
          {item.history && item.history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Record
                </h3>
              </div>
              <div className="space-y-2">
                {item.history.map((entry, i) => (
                  <div
                    key={i}
                    className="text-sm p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {entry.field}changed from{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {entry.oldValue}
                      </strong>{" "}
                      a{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {entry.newValue}
                      </strong>
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleString("es-ES")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
