import React, { useMemo, useState } from "react";
import { FlatList, View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";
import BookListItem from "./BookListItem";
import CategoryFilter from "../Common/CategoryFilter";
import { PRESET_CATEGORIES, deriveCategoriesFromBooks } from "../../hooks/useBooks";

const AVAILABILITY_OPTIONS = [
  { key: "all", label: "Todos" },
  { key: "available", label: "Disponibles" },
  { key: "unavailable", label: "No disponibles" },
];

/**
 * Componente: Lista de libros para administración
 * Renderiza búsqueda, filtros, lista con estados de carga y vacío
 */
export default function AdminBooksList({ books, loading, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // Derivar categorías únicas de los libros + preset
  const categories = useMemo(() => {
    const derived = deriveCategoriesFromBooks(books);
    const unique = Array.from(new Set(derived.filter((c) => !!c)));
    return ['Todas', ...Array.from(new Set([...unique, ...PRESET_CATEGORIES].filter(Boolean)))];
  }, [books]);

  // Filtrar libros según search, categoría y disponibilidad
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Búsqueda por título o autor
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const hay = [b.title, b.author].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // Filtro por categoría
      if (selectedCategory !== "Todas") {
        const cats = Array.isArray(b.categories)
          ? b.categories
          : b.category
            ? [b.category]
            : [];
        if (!cats.includes(selectedCategory)) return false;
      }

      // Filtro por disponibilidad
      if (availabilityFilter === "available" && !b.available) return false;
      if (availabilityFilter === "unavailable" && b.available) return false;

      return true;
    });
  }, [books, searchQuery, selectedCategory, availabilityFilter]);

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

  const renderHeader = () => (
    <View style={styles.filtersContainer}>
      {/* Search bar */}
      <View style={styles.searchInputWrapper}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título o autor..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.textMuted}
            onPress={() => setSearchQuery("")}
            style={styles.clearIcon}
          />
        )}
      </View>

      {/* Category chips */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Availability filter */}
      <View style={styles.availabilityRow}>
        {AVAILABILITY_OPTIONS.map((opt) => {
          const active = availabilityFilter === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setAvailabilityFilter(opt.key)}
              style={[styles.availChip, active && styles.availChipActive]}
            >
              <Text style={[styles.availChipText, active && styles.availChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <FlatList
      data={filteredBooks}
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
      ListHeaderComponent={renderHeader}
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
  // Filters
  filtersContainer: {
    marginBottom: 8,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
    height: 44,
  },
  clearIcon: {
    opacity: 0.7,
    padding: 2,
  },
  availabilityRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  availChip: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  availChipActive: {
    backgroundColor: colors.primary,
  },
  availChipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  availChipTextActive: {
    color: "#FFFFFF",
  },
});