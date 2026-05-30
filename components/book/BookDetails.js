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
        
        {/* Loan Status Badge - Solo Disponible/No disponible */}
        <View style={[
          styles.availabilityBadge,
          book.available ? styles.badgeAvailable : styles.badgeUnavailable,
        ]}>
          <View style={styles.badgeContent}>
            <Ionicons
              name={book.available ? "checkmark-circle" : "close-circle"}
              size={18}
              color={colors.surface}
            />
            <Text style={[styles.availabilityText, { color: colors.surface }]}>
              {book.available ? "Disponible" : "No disponible"}
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
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  imageSection: {
    position: "relative",
    backgroundColor: colors.surfaceAlt,
  },
  coverImage: {
    width: "100%",
    height: 340,
  },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
  },
  availabilityBadge: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: "rgba(0,0,0,0.12)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  infoCard: {
    backgroundColor: colors.surface,
    margin: 16,
    marginTop: -28,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary + "14",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
    width: 72,
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  descriptionSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 24,
  },
  badgeAvailable: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badgeUnavailable: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
});

// Helper functions for loan status display using Emerald/Zinc palette
const getStatusBadgeStyle = (status) => {
  // Neutral/queued requests use zinc-like neutral badge
  switch (status) {
    case STATES.REQUESTED:
    case STATES.APPROVED:
      return { backgroundColor: colors.surfaceAlt, borderColor: colors.border, iconColor: colors.textMuted };
    case STATES.DELIVERED:
      // Delivered uses Emerald emphasis
      return { backgroundColor: colors.primaryLight, borderColor: colors.primary, iconColor: colors.primary };
    case STATES.RETURNED:
    case STATES.CANCELLED:
    default:
      // Returned or Cancelled and any default use a neutral zinc-like badge
      return { backgroundColor: colors.surfaceAlt, borderColor: colors.border, iconColor: colors.textMuted };
  }
};

const getAvailabilityBadgeStyle = (available) =>
  available
    ? { backgroundColor: colors.surfaceAlt, borderColor: colors.primary, iconColor: colors.primary }
    : { backgroundColor: colors.surfaceAlt, borderColor: colors.border, iconColor: colors.textMuted };

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
