import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderBar from "../../components/HeaderBar";
import { colors } from "../../components/colors";
import useAdminBooks from "../../hooks/useAdminBooks";
import AdminBooksList from "../../components/admin/AdminBooksList";

/**
 * Screen: Administración de libros
 * Solo composición de componentes - sin lógica de negocio
 */
export default function AdminBooksScreen() {
  const navigation = useNavigation();
  const { books, loading, confirmAndDelete } = useAdminBooks();

  const handleEdit = (book) => {
    navigation.navigate("BookEdit", { id: book.id, initialData: book });
  };

  const handleDelete = (book) => {
    confirmAndDelete(book, () => {});
  };

  const handleAddBook = () => {
    navigation.navigate("BookEdit", { id: null, initialData: null });
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Gestión de Libros" navigation={navigation} />
      <AdminBooksList
        books={books}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabButton} onPress={handleAddBook} activeOpacity={0.8}>
          <Ionicons name="add" size={22} color={colors.surface} />
          <Text style={styles.fabText}>Agregar Libro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  fabButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: colors.surface,
    fontWeight: "700",
    fontSize: 16,
  },
});