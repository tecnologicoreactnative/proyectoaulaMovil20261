import React, { useState } from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";

/**
 * BookCard — Componente global de card de libro.
 *
 * Centraliza los estilos de la card para toda la app.
 * La imagen crece con el contenido (si el título es largo y estira la card,
 * la imagen también se estira).
 *
 * Uso básico (Home):
 *   <BookCard title={...} author={...} categories={...} available={...}
 *             image={...} onPress={...} />
 *
 * Con contenido personalizado (admin / préstamos):
 *   <BookCard title={...} author={...} image={...}>
 *     <StatusBadge />  ← reemplaza la fila inferior por defecto
 *   </BookCard>
 *
 * Props:
 *   title      — string (requerido)
 *   author     — string
 *   categories — string[] (solo si se quiere usar el footer por defecto)
 *   available  — boolean
 *   image      — string (url de la portada)
 *   onPress    — función al tocar la card
 *   headerSlot — elemento que se renderiza ANTES del título (ej: status badge)
 *   rightSlot  — elemento que reemplaza el chevron (ej: botones editar/eliminar)
 *   children   — reemplaza el footer por defecto (categorías + disponibilidad)
 */
export default function BookCard({
  title,
  author,
  categories = [],
  available,
  image,
  onPress,
  headerSlot,
  rightSlot,
  children,
}) {
  const [imageError, setImageError] = useState(false);

  const cardContent = (
    <View style={styles.card}>
      {/* Cover — crece con la card gracias a alignSelf: "stretch" */}
      <View style={styles.coverContainer}>
        {image && !imageError ? (
          <Image
            source={{ uri: image }}
            style={styles.coverImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="book-outline" size={26} color={colors.textMuted} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Header slot (antes del título: status badge, etc.) */}
        {headerSlot}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Author */}
        {author && (
          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
        )}

        {/* Children: contenido personalizado (reemplaza el footer default) */}
        {children}

        {/* Footer por defecto: categorías + disponibilidad (solo si no hay children) */}
        {!children && (
          <View style={styles.bottomRow}>
            {categories.length > 0 ? (
              <View style={styles.categoriesRow}>
                {categories.slice(0, 2).map((cat) => (
                  <View key={cat} style={styles.categoryTag}>
                    <Text style={styles.categoryText} numberOfLines={1}>
                      {cat}
                    </Text>
                  </View>
                ))}
                {categories.length > 2 && (
                  <Text style={styles.moreCategoriesText}>
                    +{categories.length - 2}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.spacer} />
            )}

            {available !== undefined && (
              available ? (
                <View style={styles.availBadge}>
                  <View style={styles.availDot} />
                  <Text style={styles.availText}>Disponible</Text>
                </View>
              ) : (
                <View style={[styles.availBadge, styles.availBadgeUnavail]}>
                  <View style={[styles.availDot, styles.availDotUnavail]} />
                  <Text style={[styles.availText, styles.availTextUnavail]}>Prestado</Text>
                </View>
              )
            )}
          </View>
        )}
      </View>

      {/* Right slot (reemplaza el chevron) */}
      <View style={styles.rightSlotContainer}>
        {rightSlot ?? (
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.92}
        style={styles.wrapper}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.wrapper}>{cardContent}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    minHeight: 100,
  },
  // ── Cover (crece con la card) ────────────────────────────────────────
  coverContainer: {
    width: 72,
    alignSelf: "stretch",
    backgroundColor: colors.surfaceAlt,
  },
  coverImage: {
    width: 72,
    flex: 1,
  },
  coverPlaceholder: {
    width: 72,
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  // ── Content ──────────────────────────────────────────────────────────
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: "500",
    marginBottom: 10,
  },
  bottomRow: {
    gap: 6,
  },
  // ── Categories row ──────────────────────────────────────────────────
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  categoryTag: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: "600",
  },
  moreCategoriesText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
  },
  spacer: {
    flex: 1,
  },
  // ── Availability ─────────────────────────────────────────────────────
  availBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.success + "14",
  },
  availBadgeUnavail: {
    backgroundColor: colors.error + "14",
  },
  availDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  availDotUnavail: {
    backgroundColor: colors.error,
  },
  availText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.success,
  },
  availTextUnavail: {
    color: colors.error,
  },
  // ── Right slot ───────────────────────────────────────────────────────
  rightSlotContainer: {
    justifyContent: "center",
    paddingHorizontal: 14,
  },
});
