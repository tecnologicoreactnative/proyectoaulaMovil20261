import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";
import { LOAN_STATUS_CONFIG, formatDate, STATES } from "../../constants/loans";
import useAdminLoans from "../../hooks/useAdminLoans";
import BookCard from "../book/BookCard";

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

function DateRangeFilter({ filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo }) {
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const formatDateDisplay = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFromChange = (event, selectedDate) => {
    setShowFromPicker(Platform.OS === "ios");
    if (selectedDate) {
      setFilterDateFrom(selectedDate);
    }
  };

  const handleToChange = (event, selectedDate) => {
    setShowToPicker(Platform.OS === "ios");
    if (selectedDate) {
      setFilterDateTo(selectedDate);
    }
  };

  const clearFrom = () => setFilterDateFrom(null);
  const clearTo = () => setFilterDateTo(null);

  const hasDateFilter = filterDateFrom || filterDateTo;

  return (
    <View style={styles.dateFilterContainer}>
      <View style={styles.dateFilterRow}>
        <View style={styles.dateFilterInputGroup}>
          <Text style={styles.dateFilterLabel}>Desde</Text>
          <TouchableOpacity
            style={styles.dateFilterInput}
            onPress={() => setShowFromPicker(true)}
          >
            <Text style={styles.dateFilterText}>
              {filterDateFrom ? formatDateDisplay(filterDateFrom) : "Seleccionar"}
            </Text>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          </TouchableOpacity>
          {filterDateFrom && (
            <TouchableOpacity onPress={clearFrom} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dateFilterInputGroup}>
          <Text style={styles.dateFilterLabel}>Hasta</Text>
          <TouchableOpacity
            style={styles.dateFilterInput}
            onPress={() => setShowToPicker(true)}
          >
            <Text style={styles.dateFilterText}>
              {filterDateTo ? formatDateDisplay(filterDateTo) : "Seleccionar"}
            </Text>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          </TouchableOpacity>
          {filterDateTo && (
            <TouchableOpacity onPress={clearTo} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={filterDateFrom || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleFromChange}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={filterDateTo || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleToChange}
        />
      )}

      {hasDateFilter && (
        <View style={styles.activeFilterIndicators}>
          {filterDateFrom && (
            <View style={styles.filterChipIndicator}>
              <Text style={styles.filterChipIndicatorText}>
                Desde: {formatDateDisplay(filterDateFrom)}
              </Text>
              <TouchableOpacity onPress={clearFrom}>
                <Ionicons name="close" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {filterDateTo && (
            <View style={styles.filterChipIndicator}>
              <Text style={styles.filterChipIndicatorText}>
                Hasta: {formatDateDisplay(filterDateTo)}
              </Text>
              <TouchableOpacity onPress={clearTo}>
                <Ionicons name="close" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function UserFilter({ users, filterUserId, setFilterUserId }) {
  const [showPicker, setShowPicker] = useState(false);
  const userList = Object.values(users || {})
    .filter((u) => u.displayName || u.email)
    .sort((a, b) => (a.displayName || a.email || "").localeCompare(b.displayName || b.email || ""));

  const clearUser = () => {
    setFilterUserId(null);
    setShowPicker(false);
  };

  const selectedUser = filterUserId ? users[filterUserId] : null;

  return (
    <View style={styles.userFilterContainer}>
      <TouchableOpacity
        style={styles.userFilterTrigger}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="person-outline" size={14} color={selectedUser ? colors.primary : colors.textMuted} />
        <Text style={[styles.userFilterTriggerText, selectedUser && styles.userFilterTriggerTextActive]}>
          {selectedUser
            ? (selectedUser.displayName || selectedUser.email || "Usuario")
            : "Filtrar por usuario"}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <TouchableOpacity
          style={styles.userModalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.userModalContent}>
            <View style={styles.userModalHeader}>
              <Text style={styles.userModalTitle}>Seleccionar usuario</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.userModalScroll} keyboardShouldPersistTaps="handled">
              <TouchableOpacity
                style={[styles.userModalItem, !selectedUser && styles.userModalItemActive]}
                onPress={() => {
                  setFilterUserId(null);
                  setShowPicker(false);
                }}
              >
                <Ionicons name="people-outline" size={18} color={!selectedUser ? colors.primary : colors.textMuted} />
                <Text style={[styles.userModalItemText, !selectedUser && styles.userModalItemTextActive]}>
                  Todos los usuarios
                </Text>
                {!selectedUser && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>

              <View style={styles.userModalDivider} />

              {userList.map((u) => {
                const isSelected = filterUserId === u.uid;
                return (
                  <TouchableOpacity
                    key={u.uid}
                    style={[styles.userModalItem, isSelected && styles.userModalItemActive]}
                    onPress={() => {
                      setFilterUserId(u.uid);
                      setShowPicker(false);
                    }}
                  >
                    <View style={styles.userModalAvatar}>
                      <Ionicons name="person" size={16} color={isSelected ? colors.primary : colors.textMuted} />
                    </View>
                    <View style={styles.userModalItemInfo}>
                      <Text style={[styles.userModalItemText, isSelected && styles.userModalItemTextActive]}>
                        {u.displayName || "Sin nombre"}
                      </Text>
                      {u.email ? (
                        <Text style={styles.userModalItemSubtext}>{u.email}</Text>
                      ) : null}
                    </View>
                    {isSelected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}

              {userList.length === 0 && (
                <View style={styles.userModalEmpty}>
                  <Ionicons name="people-outline" size={32} color={colors.textMuted} />
                  <Text style={styles.userModalEmptyText}>No hay usuarios registrados</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {filterUserId && (
        <View style={styles.filterChipIndicator}>
          <Text style={styles.filterChipIndicatorText}>
            Usuario: {users[filterUserId]?.displayName || users[filterUserId]?.email}
          </Text>
          <TouchableOpacity onPress={clearUser}>
            <Ionicons name="close" size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
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
    <BookCard
      title={loan.book?.title || "Libro eliminado"}
      author={loan.book?.author || "Sin autor"}
      image={loan.book?.image}
      headerSlot={<StatusBadge status={loan.status} />}
    >
      {/* Borrower info */}
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
    </BookCard>
  );
}

// ── Main component ───────────────────────────────────────────────────

export default function AdminLoansList() {
  const {
    filteredLoans,
    loading,
    filterStatus,
    setFilterStatus,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    filterUserId,
    setFilterUserId,
    stats,
    approveLoan,
    markDelivered,
    markReturned,
    cancelLoan,
    users,
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

  const hasActiveFilters =
    filterStatus !== null ||
    filterDateFrom !== null ||
    filterDateTo !== null ||
    filterUserId !== null;

  const clearAllFilters = () => {
    setFilterStatus(null);
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setFilterUserId(null);
  };

  const renderFilters = () => (
    <>
      <FilterBar
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <DateRangeFilter
        filterDateFrom={filterDateFrom}
        setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo}
        setFilterDateTo={setFilterDateTo}
      />
      <UserFilter
        users={users}
        filterUserId={filterUserId}
        setFilterUserId={setFilterUserId}
      />
      {hasActiveFilters && (
        <TouchableOpacity
          style={styles.clearAllBtn}
          onPress={clearAllFilters}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={14} color={colors.error} />
          <Text style={styles.clearAllBtnText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </>
  );

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
        {renderFilters()}
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
              ? "Probá con otros filtros"
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
      {renderFilters()}

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

  // ── Loan Card (usa BookCard para cover + info) ──────────────────────
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

  // ── Date Range Filter ───────────────────────────────────────────────
  dateFilterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dateFilterRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateFilterInputGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateFilterLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  dateFilterInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateFilterText: {
    fontSize: 13,
    color: colors.text,
  },
  clearBtn: {
    padding: 2,
  },
  activeFilterIndicators: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  filterChipIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "18",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  filterChipIndicatorText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },

  // ── User Filter ────────────────────────────────────────────────────
  userFilterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userFilterTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userFilterTriggerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  userFilterTriggerTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  userModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  userModalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  userModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userModalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  userModalScroll: {
    maxHeight: 400,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  userModalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 2,
  },
  userModalItemActive: {
    backgroundColor: colors.primary + "12",
  },
  userModalItemInfo: {
    flex: 1,
  },
  userModalItemText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },
  userModalItemTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  userModalItemSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  userModalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  userModalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  userModalEmpty: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  userModalEmptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  // ── Clear All Filters ──────────────────────────────────────────────
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error + "40",
    backgroundColor: colors.error + "0A",
    gap: 6,
  },
  clearAllBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.error,
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
