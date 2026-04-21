import React from "react";
import { View, StyleSheet } from "react-native";
import HeaderBar from "../components/HeaderBar";
import BookForm from "../components/book/BookForm";
import useBooks from "../hooks/useBooks";
import { colors } from "../components/colors";

export default function AddBook({ navigation }) {
  const { addBook } = useBooks();

  const handleAdd = async (data, imageBase64) => {
    await addBook(data, imageBase64);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Agregar libro" navigation={navigation} />
      <BookForm onAdd={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
