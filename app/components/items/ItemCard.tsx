import { PulseItem } from "../../domain/types";
import { ChevronRight, Tag, User, Zap, Target } from "lucide-react";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../../domain/constants";
import { calculateScore } from "../../domain/score";
import { ScoreTooltip } from "../common/ScoreTooltip";

export function ItemCard({
  item,
  onClick,
}: {
  item: PulseItem;
  onClick: () => void;
}) {
  const PriorityIcon = PRIORITY_CONFIG[item.priority].icon;
  const score = calculateScore(item);

  return (
    <article
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer group"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Ver detalles de ${item.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {item.id}
            </span>
            {item.owner && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <User className="w-3 h-3" />
                <span>{item.owner}</span>
              </div>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        </div>

        <span
          className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${PRIORITY_CONFIG[item.priority].color}`}
        >
          <PriorityIcon className="w-3.5 h-3.5" aria-hidden="true" />
          {PRIORITY_CONFIG[item.priority].label}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[item.status].color}`}
            aria-hidden="true"
          />
          <span
            className={`text-sm font-medium ${STATUS_CONFIG[item.status].textColor} dark:text-opacity-90`}
          >
            {STATUS_CONFIG[item.status].label}
          </span>
        </div>

        <div
          className="h-4 w-px bg-gray-300 dark:bg-gray-600"
          aria-hidden="true"
        />

        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <Zap className="inline w-3.5 h-3.5 mr-1" />
            Impacto:{" "}
            <strong className="text-gray-900 dark:text-white">
              {item.impact}/5
            </strong>
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            <Target className="inline w-3.5 h-3.5 mr-1" />
            Esfuerzo:{" "}
            <strong className="text-gray-900 dark:text-white">
              {item.effort}/5
            </strong>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ScoreTooltip />
          <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
            Score: {score}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
        </div>
      </div>
    </article>
  );
}
