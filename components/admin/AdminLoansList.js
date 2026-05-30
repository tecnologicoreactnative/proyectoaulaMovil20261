import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";
import { LOAN_STATUS_CONFIG, formatDate, STATES } from "../../constants/loans";
import useAdminLoans from "../../hooks/useAdminLoans";

const filterOptions = [
  { key: null, label: "Todos" },
  { key: STATES.REQUESTED, label: "Solicitado" },
  { key: STATES.APPROVED, label: "Aprobado" },
  { key: STATES.DELIVERED, label: "Entregado" },
  { key: STATES.RETURNED, label: "Devuelto" },
  { key: STATES.CANCELLED, label: "Cancelado" },
];

// ── Stat card definitions ────────────────────────────────────────────
const statCards = [
  { key: "solicitado", label: "Solicitados", color: colors.warning },
  { key: "aprobado", label: "Aprobados", color: colors.info },
  { key: "entregado", label: "Entregados", color: colors.success },
  { key: "devuelto", label: "Devueltos", color: colors.success },
  { key: "cancelado", label: "Cancelados", color: colors.error },
  { key: "total", label: "Total", color: colors.text },
];



// ── Sub-components ───────────────────────────────────────────────────

function StatsBar({ stats }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.statsScroll}
      contentContainerStyle={styles.statsContent}
    >
      {statCards.map((s) => (
        <View key={s.key} style={styles.statCard}>
          <Text style={[styles.statNumber, { color: s.color }]}>
            {stats[s.key] ?? 0}
          </Text>
          <Text style={styles.statLabel}>{s.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function FilterBar({ filterStatus, setFilterStatus }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterContent}
    >
      {filterOptions.map((opt) => {
        const active = filterStatus === opt.key;
        return (
          <TouchableOpacity
            key={opt.label}
            style={[
              styles.filterChip,
              active && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(opt.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                active && styles.filterChipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function StatusBadge({ status }) {
  const config = LOAN_STATUS_CONFIG[status] || {
    label: status,
    icon: "help-outline",
    color: colors.textMuted,
    bg: colors.surfaceAlt,
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={10} color={config.color} />
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

function ActionButton({ label, onPress, variant }) {
  const isPrimary = variant === "primary";
  const isDestructive = variant === "destructive";

  return (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        isPrimary && styles.actionBtnPrimary,
        isDestructive && styles.actionBtnDestructive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.actionBtnText,
          (isPrimary || isDestructive) && styles.actionBtnTextLight,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function LoanCard({ loan, onApprove, onMarkDelivered, onMarkReturned, onCancel }) {
  const [imageError, setImageError] = useState(false);
  const config = LOAN_STATUS_CONFIG[loan.status] || {
    label: loan.status,
    icon: "help-outline",
    color: colors.textMuted,
    bg: colors.surfaceAlt,
  };

  const renderActions = () => {
    switch (loan.status) {
      case STATES.REQUESTED:
        return (
          <View style={styles.actionsRow}>
            <ActionButton
              label="Aprobar"
              variant="primary"
              onPress={() => onApprove(loan.id)}
            />
            <ActionButton
              label="Cancelar"
              variant="destructive"
              onPress={() => onCancel(loan.id)}
            />
          </View>
        );
      case STATES.APPROVED:
        return (
          <View style={styles.actionsRow}>
            <ActionButton
              label="Marcar entregado"
              variant="primary"
              onPress={() => onMarkDelivered(loan.id)}
            />
            <ActionButton
              label="Cancelar"
              variant="destructive"
              onPress={() => onCancel(loan.id)}
            />
          </View>
        );
      case STATES.DELIVERED:
        return (
          <View style={styles.actionsRow}>
            <ActionButton
              label="Marcar devuelto"
              variant="primary"
              onPress={() => onMarkReturned(loan.id)}
            />
          </View>
        );
      case STATES.RETURNED:
      case STATES.CANCELLED:
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      {/* Book Cover */}
      <View style={styles.coverContainer}>
        {loan.book?.image && !imageError ? (
          <Image
            source={{ uri: loan.book.image }}
            style={styles.cover}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="book" size={24} color={colors.textMuted} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <StatusBadge status={loan.status} />

        <Text style={styles.bookTitle} numberOfLines={1}>
          {loan.book?.title || "Libro eliminado"}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {loan.book?.author || "Sin autor"}
        </Text>
        <View style={styles.borrowerRow}>
          <Ionicons name="person-outline" size={11} color={colors.textMuted} />
          <Text style={styles.borrowerEmail} numberOfLines={1}>
            {loan.borrower?.firstName
              ? `${loan.borrower.firstName} ${loan.borrower.lastName}`
              : loan.borrower?.email || "Usuario desconocido"}
          </Text>
          {loan.borrower?.delayCount > 0 && (
            <Ionicons name="warning" size={11} color={colors.warning} />
          )}
          {loan.borrower?.penaltyUntil?.toDate?.() > new Date() && (
            <Ionicons name="ban" size={11} color={colors.error} />
          )}
        </View>

        {/* Date info */}
        <Text style={styles.dateLabel}>
          Solicitado: {formatDate(loan.requestedAt)}
          {loan.deliveredAt ? ` · Entrega: ${formatDate(loan.deliveredAt)}` : ""}
          {loan.maxReturnDate
            ? ` · Tope: ${formatDate(loan.maxReturnDate)}`
            : ""}
        </Text>

        {/* Action Buttons */}
        {renderActions()}
      </View>
    </View>
  );
}

// ── Main component ───────────────────────────────────────────────────

export default function AdminLoansList() {
  const {
    filteredLoans,
    loading,
    filterStatus,
    setFilterStatus,
    stats,
    approveLoan,
    markDelivered,
    markReturned,
    cancelLoan,
  } = useAdminLoans();

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando préstamos...</Text>
      </View>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────
  if (!filteredLoans || filteredLoans.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <StatsBar stats={stats} />
        <FilterBar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <Ionicons name="file-tray-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>
            {filterStatus
              ? "No hay préstamos en este estado"
              : "No hay préstamos registrados"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {filterStatus
              ? "Prueba con otro filtro"
              : "Los préstamos aparecerán aquí cuando los usuarios soliciten libros"}
          </Text>
        </View>
      </ScrollView>
    );
  }

  // ── Main render ────────────────────────────────────────────────────
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      <StatsBar stats={stats} />
      <FilterBar
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <View style={styles.loansList}>
        {filteredLoans.map((loan) => (
          <LoanCard
            key={loan.id}
            loan={loan}
            onApprove={approveLoan}
            onMarkDelivered={markDelivered}
            onMarkReturned={markReturned}
            onCancel={cancelLoan}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },

  // ── Stats Bar ──────────────────────────────────────────────────────
  statsScroll: {
    flexGrow: 0,
    paddingVertical: 12,
  },
  statsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 72,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "500",
    marginTop: 2,
  },

  // ── Filter Bar ─────────────────────────────────────────────────────
  filterScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textLight,
  },
  filterChipTextActive: {
    color: colors.surface,
  },

  // ── Loans List ─────────────────────────────────────────────────────
  loansList: {
    paddingHorizontal: 16,
    gap: 12,
  },

  // ── Loan Card ──────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  coverContainer: {
    marginRight: 12,
    overflow: "hidden",
  },
  cover: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "600",
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  bookAuthor: {
    fontSize: 13,
    color: colors.textLight,
  },
  borrowerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  borrowerEmail: {
    fontSize: 11,
    color: colors.textMuted,
    flexShrink: 1,
  },
  dateLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ── Action Buttons ─────────────────────────────────────────────────
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
  },
  actionBtnPrimary: {
    backgroundColor: colors.primary,
  },
  actionBtnDestructive: {
    backgroundColor: colors.error,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textLight,
  },
  actionBtnTextLight: {
    color: colors.surface,
  },

  // ── Empty State ────────────────────────────────────────────────────
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
