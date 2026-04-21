import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import useLoans from "../../hooks/useLoans";
import useBooks from "../../hooks/useBooks";
import { colors } from "../colors";

// Status config
const statusConfig = {
  solicitado: { label: "Solicitado", icon: "time-outline", color: colors.warning, bg: colors.warning + "15" },
  aprobado: { label: "Aprobado", icon: "checkmark-circle-outline", color: colors.info, bg: colors.info + "15" },
  entrega: { label: "Entregado", icon: "cube-outline", color: colors.success, bg: colors.success + "15" },
  cancelado: { label: "Cancelado", icon: "close-circle-outline", color: colors.error, bg: colors.error + "15" },
};

// Helper to format dates
const formatDate = (date) => {
  if (!date) return "—";
  if (typeof date === "object" && date.toLocaleDateString) {
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
    });
  }
  return String(date);
};

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
    const statusMap = {
      [STATES.REQUESTED]: "solicitado",
      [STATES.APPROVED]: "aprobado",
      [STATES.DELIVERED]: "entrega",
    };
    return statusConfig[statusMap[status]] || { label: status, icon: "help-outline", color: colors.textMuted, bg: colors.surfaceAlt };
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
      `¿Estás seguro de que quieres cancelar esta solicitud?"`,
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
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={10} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>

          {/* Title & Author */}
          <Text style={styles.bookTitle} numberOfLines={1}>{book?.title || "Libro"}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>{book?.author || "Autor"}</Text>

          {/* Bottom Row */}
          <View style={styles.bottomRow}>
            <Text style={styles.dateText}>
              {formatDate(item.deliveredAt || item.approvedAt || item.requestedAt)}
            </Text>
            
            {item.status === STATES.DELIVERED ? (
              <TouchableOpacity
                style={styles.returnButton}
                onPress={() => handleReturn(item.id, book?.title || "el libro")}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Ionicons name="arrow-undo" size={14} color={colors.surface} />
                )}
              </TouchableOpacity>
            ) : item.status === STATES.REQUESTED || item.status === STATES.APPROVED ? (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(item.id, book?.title || "el libro")}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
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
        </View>
      </View>
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
          <Ionicons name="book-outline" size={28} color={colors.textMuted} />
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
    marginBottom: 12,
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
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 9,
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  dateText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  returnButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.surface,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  pendingText: {
    fontSize: 9,
    fontWeight: "600",
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

export default ActiveLoansList;
