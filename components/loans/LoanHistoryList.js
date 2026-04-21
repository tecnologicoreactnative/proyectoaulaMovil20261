import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import useLoans from "../../hooks/useLoans";
import useBooks from "../../hooks/useBooks";
import { colors } from "../colors";

// Helper to format dates
const formatDate = (date) => {
  if (!date) return "—";
  if (typeof date === "object" && date.toLocaleDateString) {
    return date.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
  }
  return String(date);
};

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
    
    return (
      <View key={item.id} style={styles.card}>
        {/* Book Cover */}
        <View style={styles.coverContainer}>
          {book?.image ? (
            <Image source={{ uri: book.image }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="book-outline" size={20} color={colors.textMuted} />
            </View>
          )}
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            {item.status === STATES.CANCELLED ? (
              <>
                <Ionicons name="close-circle" size={10} color={colors.error} />
                <Text style={[styles.statusText, { color: colors.error }]}>Cancelado</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={10} color={colors.success} />
                <Text style={styles.statusText}>Devuelto</Text>
              </>
            )}
          </View>

          {/* Title & Author */}
          <Text style={styles.bookTitle} numberOfLines={1}>{book?.title || "Libro"}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>{book?.author || "Autor"}</Text>

          {/* Date */}
          <Text style={styles.dateText}>
            {formatDate(item.returnedAt)}
          </Text>
        </View>
      </View>
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
    marginBottom: 12,
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
    gap: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  coverContainer: {
    width: 50,
    height: 70,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: "600",
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  bookAuthor: {
    fontSize: 10,
    color: colors.textMuted,
  },
  dateText: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
  },
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default LoanHistoryList;
