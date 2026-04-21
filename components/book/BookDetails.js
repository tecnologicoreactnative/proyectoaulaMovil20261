import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LoanButton from "../LoanButton";
import { colors } from "../colors";
import useLoans from "../../hooks/useLoans";
import { useAuth } from "../../contexts/AuthContext";

// Loan states
const STATES = {
  REQUESTED: "solicitado",
  APPROVED: "aprobado",
  DELIVERED: "entregado",
  RETURNED: "devuelto",
  CANCELLED: "cancelado",
};

export default function BookDetails({ book }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth() || {};
  const { userLoans, subscribeToUserLoans } = useLoans();
  const [activeLoan, setActiveLoan] = useState(null);

  // Subscribe to user loans to get loan status for this book
  useEffect(() => {
    if (!user?.uid || !book?.id) return;
    const unsub = subscribeToUserLoans(user.uid);
    return () => unsub && unsub();
  }, [user?.uid, book?.id]);

  // Find active loan for this book
  useEffect(() => {
    if (!userLoans || !book?.id) {
      setActiveLoan(null);
      return;
    }
    const loan = userLoans.find(
      (l) => l.bookId === book.id &&
      (l.status === STATES.REQUESTED || l.status === STATES.APPROVED || l.status === STATES.DELIVERED)
    );
    setActiveLoan(loan || null);
  }, [userLoans, book?.id]);

  if (!book) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="book-outline" size={48} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Sin detalles</Text>
        <Text style={styles.emptyDescription}>
          No hay información disponible para este libro.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Image Section */}
      <View style={styles.imageSection}>
        {book.image ? (
          <Image
            source={{ uri: book.image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="book" size={80} color={colors.textMuted} />
          </View>
        )}
        
        {/* Gradient Overlay */}
        <View style={styles.imageOverlay} />
        
        {/* Loan Status Badge */}
        <View style={[
          styles.availabilityBadge,
          activeLoan ? getStatusBadgeColor(activeLoan.status) : (book.available ? colors.success : colors.error)
        ]}>
          <View style={styles.badgeContent}>
            <Ionicons 
              name={activeLoan ? getStatusIcon(activeLoan.status) : (book.available ? "checkmark-circle" : "close-circle")} 
              size={16} 
              color={colors.surface} 
            />
            <Text style={styles.availabilityText}>
              {activeLoan ? getStatusText(activeLoan.status) : (book.available ? "Disponible" : "No disponible")}
            </Text>
          </View>
        </View>
      </View>

      {/* Book Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        
        {/* Author */}
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
          </View>
          <Text style={styles.infoLabel}>Autor</Text>
          <Text style={styles.infoValue}>{book.author}</Text>
        </View>

        {/* Category if exists */}
        {book.category && (
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.infoLabel}>Categoría</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{book.category}</Text>
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description */}
        <View style={styles.descriptionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color={colors.text} />
            <Text style={styles.sectionTitle}>Descripción</Text>
          </View>
          <Text style={styles.descriptionText}>
            {book.description || "Sin descripción disponible."}
          </Text>
        </View>

        {/* Loan Button */}
        <View style={styles.buttonContainer}>
          <LoanButton book={book} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  imageSection: {
    position: "relative",
    backgroundColor: colors.surfaceAlt,
  },
  coverImage: {
    width: "100%",
    height: 320,
  },
  imagePlaceholder: {
    width: "100%",
    height: 280,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
  },
  availabilityBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  availabilityText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  infoCard: {
    backgroundColor: colors.surface,
    margin: 16,
    marginTop: -24,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary + "12",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
    width: 70,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  descriptionSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

// Helper functions for loan status display
const getStatusBadgeColor = (status) => {
  switch (status) {
    case STATES.REQUESTED: return colors.warning;
    case STATES.APPROVED: return colors.primary;
    case STATES.DELIVERED: return colors.success;
    case STATES.RETURNED: return colors.textMuted;
    case STATES.CANCELLED: return colors.error;
    default: return colors.success;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case STATES.REQUESTED: return "time-outline";
    case STATES.APPROVED: return "checkmark-circle";
    case STATES.DELIVERED: return "arrow-forward-circle";
    case STATES.RETURNED: return "checkmark-done-circle";
    case STATES.CANCELLED: return "close-circle";
    default: return "checkmark-circle";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case STATES.REQUESTED: return "Solicitado";
    case STATES.APPROVED: return "Aprobado";
    case STATES.DELIVERED: return "Entregado";
    case STATES.RETURNED: return "Devuelto";
    case STATES.CANCELLED: return "Cancelado";
    default: return "Disponible";
  }
};
