import React from "react";
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";
import BookListItem from "./BookListItem";

/**
 * Componente: Lista de libros para administración
 * Renderiza lista con estados de carga y vacío
 */
export default function AdminBooksList({ books, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando libros...</Text>
      </View>
    );
  }

  if (!books || books.length === 0) {
    return (
      <View style={styles.centered}>
        <View style={styles.emptyIcon}>
          <Ionicons name="library-outline" size={48} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No hay libros</Text>
        <Text style={styles.emptySubtitle}>Agrega el primer libro a la biblioteca</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <BookListItem
          book={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
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