import { PulseItem } from "../../types/pulse";
import { calculateScore } from "../../lib/scoring";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../../lib/constants";

interface Props {
  item: PulseItem;
}

export function ItemCard({ item }: Props) {
  const score = calculateScore(item);
  const PriorityIcon = PRIORITY_CONFIG[item.priority].icon;

  return (
    <article
      className="bg-white border rounded-lg p-5 hover:shadow-md transition"
      aria-labelledby={`item-${item.id}`}
    >
      <header className="flex justify-between gap-3 mb-3">
        <h3 id={`item-${item.id}`} className="font-semibold text-gray-900">
          {item.title}
        </h3>

        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-full ${PRIORITY_CONFIG[item.priority].className}`}
        >
          <PriorityIcon className="w-3 h-3" aria-hidden />
          {PRIORITY_CONFIG[item.priority].label}
        </span>
      </header>

      <div className="flex items-center gap-3 text-sm">
        <span
          className={`flex items-center gap-1 ${STATUS_CONFIG[item.status].text}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${STATUS_CONFIG[item.status].dot}`}
          />
          {STATUS_CONFIG[item.status].label}
        </span>

        <span className="text-gray-500">
          Impacto: <strong>{item.impact}</strong>
        </span>

        <span className="text-gray-500">
          Esfuerzo: <strong>{item.effort}</strong>
        </span>
      </div>

      <footer className="mt-3 text-sm font-semibold text-purple-600">
        Score: {score}
      </footer>
    </article>
  );
}
