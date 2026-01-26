import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

export const PRIORITY_CONFIG = {
  critical: {
    label: "Crítico",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800 border-red-300",
    weight: 100,
  },
  high: {
    label: "Alto",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-800 border-orange-300",
    weight: 50,
  },
  medium: {
    label: "Medio",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    weight: 25,
  },
  low: {
    label: "Bajo",
    icon: CheckCircle2,
    color: "bg-gray-100 text-gray-800 border-gray-300",
    weight: 10,
  },
} as const;
