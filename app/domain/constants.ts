import {
  AlertCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
 } from "lucide-react";

export const STATUS_CONFIG = {
  new: {
    label: "New",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgLight: "bg-blue-50",
  },
  triaged: {
    label: "Triaged",
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgLight: "bg-purple-50",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
  },
  done: {
    label: "Completed",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
  },
} as const;

export const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    weight: 0,
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: Clock,
  },
  medium: {
    label: "Medium",
    weight: 2,
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: AlertCircle,
  },
  high: {
    label: "High",
    weight: 4,
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: TrendingUp,
  },
  critical: {
    label: "Critical",
    weight: 6,
    color: "bg-red-100 text-red-800 border-red-300",
    icon: AlertTriangle,
  },
} as const;