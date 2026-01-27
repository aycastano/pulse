import { PulseItem } from '../domain/types';
import { PRIORITY_CONFIG } from '../domain/constants';

export function calculateScore(item: PulseItem): number {
  return item.impact * 2
    + PRIORITY_CONFIG[item.priority].weight
    - item.effort;
}
