import { PulseItem } from "../types/pulse";

const PRIORITY_WEIGHT = {
  critical: 6,
  high: 4,
  medium: 2,
  low: 0,
};

export function calculateScore(item: PulseItem): number {
  return item.impact * 2 + PRIORITY_WEIGHT[item.priority] - item.effort;
}
