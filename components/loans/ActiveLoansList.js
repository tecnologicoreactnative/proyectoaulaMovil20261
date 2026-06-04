import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import useLoans from "../../hooks/useLoans";
import useBooks from "../../hooks/useBooks";
import { LOAN_STATUS_CONFIG, formatDate } from "../../constants/loans";
import { colors } from "../colors";
import BookCard from "../book/BookCard";

// ActiveLoansList: muestra préstamos activos
const ActiveLoansList = () => {
  const { user } = useAuth();
  const { userLoans, userLoansLoading, subscribeToUserLoans, markReturned, cancelLoan, loading, STATES } = useLoans();
  const { books } = useBooks();
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToUserLoans(user.uid);
      return () => unsubscribe && unsubscribe();
    }
  }, [user?.uid, subscribeToUserLoans]);

  const activeLoans = userLoans.filter(
    (loan) => loan.status === STATES.REQUESTED || loan.status === STATES.APPROVED || loan.status === STATES.DELIVERED
  );

  const getBookInfo = (bookId) => {
    return books.find((b) => b.id === bookId) || null;
  };

  const getStatusConfig = (status) => {
    return LOAN_STATUS_CONFIG[status] || { label: status, icon: "help-outline", color: colors.textMuted, bg: colors.surfaceAlt };
  };

  const handleReturn = (loanId, bookTitle) => {
    Alert.alert(
      "Devolver Libro",
      `¿Estás seguro de que quieres devolver "${bookTitle}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, devolver",
          style: "destructive",
          onPress: async () => {
            try {
              await markReturned(loanId);
              Alert.alert("Éxito", "El libro ha sido devuelto correctamente.");
            } catch (err) {
              Alert.alert("Error", err.message || "No se pudo devolver el libro.");
            }
          },
        },
      ]
    );
  };

  const handleCancel = (loanId, bookTitle) => {
    Alert.alert(
      "Cancelar Solicitud",
      `¿Estás seguro de que quieres cancelar esta solicitud?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelLoan(loanId);
              Alert.alert("Éxito", "La solicitud ha sido cancelada.");
            } catch (err) {
              Alert.alert("Error", err.message || "No se pudo cancelar la solicitud.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const book = getBookInfo(item.bookId);
    const status = getStatusConfig(item.status);

    return (
      <BookCard
        key={item.id}
        title={book?.title || "Libro"}
        author={book?.author || "Autor"}
        image={book?.image}
        headerSlot={
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={10} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        }
      >
        {/* Bottom row: date + action */}
        <View style={styles.bottomRow}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={11} color={colors.textMuted} />
            <Text style={styles.dateText}>
              {formatDate(item.deliveredAt || item.approvedAt || item.requestedAt)}
            </Text>
          </View>

          {item.status === STATES.DELIVERED ? (
            <TouchableOpacity
              style={styles.returnBtn}
              onPress={() => handleReturn(item.id, book?.title || "el libro")}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <>
                  <Ionicons name="arrow-undo" size={13} color={colors.surface} />
                  <Text style={styles.returnBtnText}>Devolver</Text>
                </>
              )}
            </TouchableOpacity>
          ) : item.status === STATES.REQUESTED || item.status === STATES.APPROVED ? (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancel(item.id, book?.title || "el libro")}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={[styles.pendingBadge, { backgroundColor: status.bg }]}>
              <Ionicons name="time-outline" size={10} color={status.color} />
              <Text style={[styles.pendingText, { color: status.color }]}>
                {item.status === STATES.REQUESTED ? "Pendiente" : "En proceso"}
              </Text>
            </View>
          )}
        </View>
      </BookCard>
    );
  };

  if (userLoansLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Préstamos Activos</Text>
        {activeLoans.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{activeLoans.length}</Text>
          </View>
        )}
      </View>

      {activeLoans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="book-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyText}>Sin préstamos activos</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {activeLoans.map((item) => renderItem({ item }))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: "700",
  },
  list: {
    gap: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  returnBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  returnBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.surface,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.error,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.surface,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: "600",
  },
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default ActiveLoansList;
