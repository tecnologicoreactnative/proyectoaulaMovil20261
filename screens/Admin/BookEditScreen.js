import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderBar from "../../components/HeaderBar";
import BookForm from "../../components/book/BookForm";
import useAdminBooks from "../../hooks/useAdminBooks";
import { colors } from "../../components/colors";

/**
 * Screen: Editar/Crear libro
 * Solo composición - usa hooks para lógica de negocio
 */
export default function BookEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, initialData } = route.params || {};
  
  const { createBook, editBook } = useAdminBooks();
  const isEditMode = !!id;

  const handleSubmit = async (data, imageBase64) => {
    if (isEditMode) {
      await editBook(id, data, imageBase64);
    } else {
      await createBook(data, imageBase64);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderBar 
        title={isEditMode ? "Editar Libro" : "Agregar Libro"} 
        navigation={navigation} 
      />
      <BookForm 
        initialData={initialData} 
        mode={isEditMode ? "edit" : "add"} 
        onSubmit={handleSubmit} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});