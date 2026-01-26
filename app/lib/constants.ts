import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Priority, Status } from "../types/pulse";

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; className: string; icon: any }
> = {
  critical: {
    label: "Crítico",
    className: "bg-red-100 text-red-800 border-red-300",
    icon: AlertCircle,
  },
  high: {
    label: "Alto",
    className: "bg-orange-100 text-orange-800 border-orange-300",
    icon: TrendingUp,
  },
  medium: {
    label: "Medio",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  low: {
    label: "Bajo",
    className: "bg-gray-100 text-gray-800 border-gray-300",
    icon: CheckCircle2,
  },
};

export const STATUS_CONFIG: Record<
  Status,
  { label: string; dot: string; text: string }
> = {
  new: { label: "Nuevo", dot: "bg-blue-500", text: "text-blue-700" },
  "in-progress": {
    label: "En progreso",
    dot: "bg-purple-500",
    text: "text-purple-700",
  },
  blocked: { label: "Bloqueado", dot: "bg-red-500", text: "text-red-700" },
  done: { label: "Completado", dot: "bg-green-500", text: "text-green-700" },
};
