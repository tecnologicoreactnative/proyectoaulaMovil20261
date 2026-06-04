import { colors } from "../components/colors";

// ── Loan status enum ──────────────────────────────────────────────────
export const STATES = {
  REQUESTED: "solicitado",
  APPROVED: "aprobado",
  DELIVERED: "entregado",
  RETURNED: "devuelto",
  CANCELLED: "cancelado",
};

// ── Status display config (label, icon, colors) ───────────────────────
export const LOAN_STATUS_CONFIG = {
  [STATES.REQUESTED]: {
    label: "Solicitado",
    icon: "time-outline",
    color: colors.warning,
    bg: colors.warning + "18",
  },
  [STATES.APPROVED]: {
    label: "Aprobado",
    icon: "checkmark-circle-outline",
    color: colors.info,
    bg: colors.info + "18",
  },
  [STATES.DELIVERED]: {
    label: "Entregado",
    icon: "cube-outline",
    color: colors.success,
    bg: colors.success + "18",
  },
  [STATES.RETURNED]: {
    label: "Devuelto",
    icon: "checkmark-done-outline",
    color: colors.success,
    bg: colors.success + "18",
  },
  [STATES.CANCELLED]: {
    label: "Cancelado",
    icon: "close-circle-outline",
    color: colors.error,
    bg: colors.error + "18",
  },
};

// ── Loan limits ───────────────────────────────────────────────────
export const MAX_ACTIVE_LOANS = 3;
export const LOAN_DURATION_DAYS = 14;

// ── Date formatter (es-CO locale) ─────────────────────────────────────
export const formatDate = (date) => {
  if (!date) return "—";
  if (typeof date === "object" && date.toLocaleDateString) {
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
    });
  }
  return String(date);
};
