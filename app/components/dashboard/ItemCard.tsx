import { PulseItem } from "../../domain/models/pulse-item";
import { PRIORITY_CONFIG } from "../../domain/constants/pulse-config";

interface Props {
  item: PulseItem;
  score: number;
}

export function ItemCard({ item, score }: Props) {
  const PriorityIcon = PRIORITY_CONFIG[item.priority].icon;

  return (
    <article className="bg-white border rounded-lg p-5">
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-500">Score: {Math.round(score)}</p>
      <PriorityIcon className="w-4 h-4" />
    </article>
  );
}
