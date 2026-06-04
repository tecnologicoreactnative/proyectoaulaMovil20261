import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import useLoans from "../../hooks/useLoans";
import useBooks from "../../hooks/useBooks";
import { formatDate } from "../../constants/loans";
import { colors } from "../colors";
import BookCard from "../book/BookCard";

// LoanHistoryList: muestra historial de préstamos devueltos
const LoanHistoryList = () => {
  const { user } = useAuth();
  const { userLoans, userLoansLoading, subscribeToUserLoans, STATES } = useLoans();
  const { books } = useBooks();
  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeToUserLoans(user.uid);
      return () => unsubscribe && unsubscribe();
    }
  }, [user?.uid, subscribeToUserLoans]);

  const historyLoans = userLoans.filter((loan) => loan.status === STATES.RETURNED || loan.status === STATES.CANCELLED);

  const getBookInfo = (bookId) => books.find((b) => b.id === bookId) || null;

  const renderItem = ({ item }) => {
    const book = getBookInfo(item.bookId);
    const isCancelled = item.status === STATES.CANCELLED;

    return (
      <BookCard
        key={item.id}
        title={book?.title || "Libro"}
        author={book?.author || "Autor"}
        image={book?.image}
        headerSlot={
          <View style={styles.statusBadge}>
            <Ionicons
              name={isCancelled ? "close-circle" : "checkmark-circle"}
              size={10}
              color={isCancelled ? colors.error : colors.success}
            />
            <Text style={[styles.statusText, { color: isCancelled ? colors.error : colors.success }]}>
              {isCancelled ? "Cancelado" : "Devuelto"}
            </Text>
          </View>
        }
      >
        {/* Date */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={11} color={colors.textMuted} />
          <Text style={styles.dateText}>
            {formatDate(item.returnedAt)}
          </Text>
        </View>
      </BookCard>
    );
  };

  if (userLoansLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial</Text>
        </View>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial</Text>
        {historyLoans.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.countText}>{historyLoans.length}</Text>
          </View>
        )}
      </View>

      {historyLoans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="archive-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyText}>Sin historial</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {historyLoans.map((item) => renderItem({ item }))}
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
    backgroundColor: colors.surfaceAlt,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.success,
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

export default LoanHistoryList;
