import React from "react";
import { View, StyleSheet } from "react-native";
import HeaderBar from "../components/HeaderBar";
import BookDetails from "../components/book/BookDetails";
import { colors } from "../components/colors";

export default function Details({ route, navigation }) {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <HeaderBar title="Detalles del libro" navigation={navigation} />
      <BookDetails book={book} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
