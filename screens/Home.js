import React, { useCallback, useEffect, useState } from "react";
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
import { useAuth } from "../contexts/AuthContext";
import {
  Body,
  EmptyState,
  BookSkeleton,
  BookItem,
  HomeHeader,
} from "../components";
import MenuModal from "../components/MenuModal";
import { colors } from "../components/colors";
import useBooks from "../hooks/useBooks";

// BookItem and Header extracted to components/BookItem and components/HomeHeader

function Home({ navigation }) {
  const { books, loading, refresh, addBook } = useBooks();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);

  // Responsive columns: 1 for narrow, 2 medium, 3 for wide
  const numColumns = width >= 900 ? 3 : width >= 600 ? 2 : 1;
  const itemSize = Math.floor(
    (width - 32 - (numColumns - 1) * 12) / numColumns,
  );
  const columnWrapper =
    numColumns > 1 ? { justifyContent: "space-between" } : undefined;

  const renderBookItem = useCallback(
    ({ item }) => (
      <BookItem item={item} itemSize={itemSize} navigation={navigation} />
    ),
    [itemSize, navigation],
  );

  // header will be passed as ListHeaderComponent so it scrolls with the list

  useEffect(() => {
    console.log("Books updated:", books);
  }, [books]);

  const renderSkeleton = useCallback(
    () => <BookSkeleton size={itemSize} />,
    [itemSize],
  );

  const renderFooter = useCallback(() => {
    if (loading && books.length > 0) return renderSkeleton();
    return <View style={{ height: 16 }} />;
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
      <FlatList
        ListHeaderComponent={() => (
          <HomeHeader user={user} onOpenMenu={() => setMenuVisible(true)} />
        )}
        stickyHeaderIndices={[0]}
        ListFooterComponent={renderFooter}
        data={books}
        contentContainerStyle={{
          paddingBottom: 24 + insets.bottom,
          paddingTop: 8,
        }}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        numColumns={numColumns}
        columnWrapperStyle={columnWrapper}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponentStyle={{
          marginBottom: 8,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        // Show skeleton loaders while initial data is loading (handled in renderFooter)
      />

      <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {!loading && (
        <TouchableOpacity
          onPress={() => navigation.navigate("AddBook")}
          style={[styles.fab, { bottom: 28 + insets.bottom }]}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = {
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  greetingContent: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  userNameText: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 32,
  },
  userBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userBadgeText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
  },
  dateText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16,
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutText: {
    color: colors.error,
    fontWeight: "600",
    fontSize: 14,
  },
  categoryBadge: {
    marginTop: 8,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingBottom: 100,
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
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: {
    color: colors.surface,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "700",
  },
};

export default Home;
