import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BookCard from "../book/BookCard";
import { colors } from "../colors";

/**
 * Componente: Item de lista de libro para admin
 * Renderiza info del libro usando BookCard y acciones de editar/eliminar
 */
export default function BookListItem({ book, onEdit, onDelete }) {
  const categories = Array.isArray(book.categories) && book.categories.length > 0
    ? book.categories
    : book.category
    ? [book.category]
    : [];

  return (
    <BookCard
      title={book.title}
      author={book.author}
      categories={categories}
      available={book.available}
      image={book.image}
      onPress={() => onEdit(book)}
      rightSlot={
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(book)} activeOpacity={0.7}>
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(book)} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
});
