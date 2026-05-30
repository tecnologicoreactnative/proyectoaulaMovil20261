import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";

/**
 * Componente: Item de lista de libro para admin
 * Renderiza info del libro y acciones de editar/eliminar
 */
export default function BookListItem({ book, onEdit, onDelete }) {
  const { title, author, image, available } = book;
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Portada */}
      <View style={styles.coverContainer}>
        {image && !imageError ? (
          <Image
            source={{ uri: image }}
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
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.author} numberOfLines={1}>{author || "Sin autor"}</Text>
        <View style={styles.availability}>
          <Ionicons
            name={available ? "checkmark-circle" : "close-circle"}
            size={14}
            color={available ? colors.success : colors.error}
          />
          <Text style={[styles.availabilityText, { color: available ? colors.success : colors.error }]}>
            {available ? "Disponible" : "No disponible"}
          </Text>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Ionicons name="pencil" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
          <Ionicons name="trash" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 6,
  },
  availability: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: "500",
  },
  actions: {
    justifyContent: "center",
    gap: 8,
    paddingLeft: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
  },
});