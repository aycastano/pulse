import { PulseItem } from "../domain/models/pulse-item";

// ============================================================================
// MOCK DATA (Simulación realista de requests internas)
// ============================================================================

export const MOCK_ITEMS: PulseItem[] = [
  {
    id: "1",
    title: "Login falla con usuarios de Google OAuth",
    type: "bug",
    priority: "critical",
    status: "new",
    impact: 10,
    effort: 3,
    createdAt: new Date("2025-01-25"),
    submitter: "María García",
  },
  {
    id: "2",
    title: "Agregar dark mode al dashboard",
    type: "feature",
    priority: "low",
    status: "new",
    impact: 4,
    effort: 8,
    createdAt: new Date("2025-01-20"),
    submitter: "Carlos Ruiz",
  },
  {
    id: "3",
    title: "Optimizar queries de búsqueda (timeout en prod)",
    type: "improvement",
    priority: "high",
    status: "in-progress",
    impact: 8,
    effort: 5,
    createdAt: new Date("2025-01-24"),
    submitter: "Ana López",
  },
  {
    id: "4",
    title: "Export a CSV roto en reportes",
    type: "bug",
    priority: "medium",
    status: "blocked",
    impact: 6,
    effort: 2,
    createdAt: new Date("2025-01-23"),
    submitter: "Pedro Sánchez",
  },
  {
    id: "5",
    title: "Integración con Slack para notificaciones",
    type: "feature",
    priority: "medium",
    status: "new",
    impact: 7,
    effort: 6,
    createdAt: new Date("2025-01-22"),
    submitter: "Laura Martín",
  },
  {
    id: "6",
    title: "Refactor del sistema de permisos",
    type: "improvement",
    priority: "high",
    status: "in-progress",
    impact: 9,
    effort: 10,
    createdAt: new Date("2025-01-21"),
    submitter: "Diego Torres",
  },
];
