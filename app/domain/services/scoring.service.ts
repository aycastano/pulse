import { PulseItem } from "../models/pulse-item";
import { PRIORITY_CONFIG } from "../constants/pulse-config";

export function calculateScore(item: PulseItem): number {
  const priorityWeight = PRIORITY_CONFIG[item.priority].weight;
  const impactBonus = item.impact * 5;
  const effortPenalty = item.effort / 10;

  return (priorityWeight + impactBonus) / (1 + effortPenalty);
}
