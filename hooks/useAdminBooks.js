import { useCallback } from "react";
import { Alert } from "react-native";
import useBooks from "./useBooks";

/**
 * Hook para operaciones de administración de libros
 * - Valida operaciones antes de ejecutarse
 * - Maneja errores y feedback al usuario
 */
export default function useAdminBooks() {
  const { books, deleteBook, addBook, updateBook, loading } = useBooks();

  /**
   * Elimina un libro con validación y confirmación
   */
  const confirmAndDelete = useCallback((book, onDeleted) => {
    if (!book?.id) {
      Alert.alert("Error", "ID de libro inválido");
      return;
    }

    Alert.alert(
      "Eliminar libro",
      `¿Estás seguro de eliminar "${book.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook(book.id);
              Alert.alert("Éxito", "Libro eliminado correctamente");
              onDeleted?.();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el libro");
            }
          },
        },
      ]
    );
  }, [deleteBook]);

  /**
   * Crea un nuevo libro (wrapper con validación)
   */
  const createBook = useCallback(async (data, imageBase64) => {
    if (!data?.title?.trim()) {
      Alert.alert("Validación", "El título es requerido");
      return { error: true };
    }
    if (!data?.author?.trim()) {
      Alert.alert("Validación", "El autor es requerido");
      return { error: true };
    }
    if (!imageBase64) {
      Alert.alert("Validación", "La imagen de portada es requerida");
      return { error: true };
    }

    try {
      const result = await addBook(data, imageBase64);
      return result;
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el libro");
      return { error: true };
    }
  }, [addBook]);

  /**
   * Actualiza un libro (wrapper con validación)
   */
  const editBook = useCallback(async (id, data, imageBase64) => {
    if (!id) {
      Alert.alert("Error", "ID de libro requerido");
      return { error: true };
    }
    if (!data?.title?.trim()) {
      Alert.alert("Validación", "El título es requerido");
      return { error: true };
    }

    try {
      await updateBook(id, data, imageBase64);
      return { success: true };
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el libro");
      return { error: true };
    }
  }, [updateBook]);

  return {
    books,
    loading,
    confirmAndDelete,
    createBook,
    editBook,
  };
}