import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { Body, EmptyState } from "../index";
import BookItem from "../book/BookItem";
import BookSkeleton from "../book/BookSkeleton";
import { colors } from "../colors";
import HomeFilters from "./HomeFilters";
import { PRESET_CATEGORIES, deriveCategoriesFromBooks } from "../../hooks/useBooks";
import useBooks from "../../hooks/useBooks";

export default function HomeContent({ navigation }) {
  const { books, loading, refresh } = useBooks();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Filters state and data
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const categories = useMemo(() => {
    // derive categories from books, but also include preset categories
    const derived = deriveCategoriesFromBooks(books);
    const unique = Array.from(new Set(derived.filter((c) => !!c)));
    return ['Todas', ...Array.from(new Set([ ...unique, ...PRESET_CATEGORIES ].filter(Boolean)))];
  }, [books]);

  const matchesQuery = useCallback((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const hay = [b.title, b.author, Array.isArray(b.categories) ? b.categories.join(' ') : (b.category ? b.category : ''), b.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }, [searchQuery]);
  const filteredBooks = books.filter((b) => {
    const hasCategory = selectedCategory === 'Todas' || (Array.isArray(b.categories) ? b.categories.includes(selectedCategory) : (b.category === selectedCategory));
    return hasCategory && matchesQuery(b);
  });

  // Fixed width for horizontal card
  const cardWidth = useWindowDimensions().width - 32;

  // Stable header element to prevent remount of the search TextInput
  const headerElement = useMemo(
    () => (
      <HomeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
    ),
    [searchQuery, categories, selectedCategory]
  );

  const renderBookItem = useCallback(
    ({ item }) => (
      <BookItem item={item} itemSize={cardWidth} navigation={navigation} />
    ),
    [cardWidth, navigation],
  );

  const renderSkeleton = useCallback(
    () => <BookSkeleton size={cardWidth} />,
    [cardWidth],
  );

  const renderFooter = useCallback(() => {
    if (loading && books.length > 0) return renderSkeleton();
    return <View style={{ height: 100 }} />;
  }, [loading, books, renderSkeleton]);

  const renderEmptyState = useCallback(() => {
    if (loading === true) return null;
    return (
      <EmptyState
        title="No hay libros"
        description="Agrega tu primer libro para comenzar tu biblioteca digital"
        action={
          <Text style={styles.emptySubtitle}>
            Comienza llenando el formulario arriba
          </Text>
        }
      />
    );
  }, [loading]);

  if (loading && books.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Body style={{ marginTop: 16, color: colors.textMuted }}>
          Cargando biblioteca...
        </Body>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <Ionicons name="library" size={24} color={colors.primary} />
        </View>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Biblioteca</Text>
          <Text style={styles.heroSubtitle}>
            {books.length} {books.length === 1 ? "libro" : "libros"} disponibles
          </Text>
        </View>
      </View>

      {/* Book List - Vertical */}
      <FlatList
        data={filteredBooks}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100 + insets.bottom,
          paddingTop: 12,
          gap: 10,
        }}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={headerElement}
      />

      {/* FAB for Admin */}
      {!loading && user?.role === "admin" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddBook")}
          style={[styles.fab, { bottom: 28 + insets.bottom }]}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={colors.surface} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = {
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingBottom: 100,
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  emptySubtitle: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 12,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};
