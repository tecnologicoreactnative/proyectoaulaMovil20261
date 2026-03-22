import React from "react";
import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookForm from "../components/home/book-form";
import Heading from "../components/Heading";
import Body from "../components/Body";
import { colors } from "../components/colors";
import useBooks from "../hooks/useBooks";

export default function AddBook({ navigation }) {
  const insets = useSafeAreaInsets();
  const { addBook } = useBooks();

  const handleAdd = async (data, imageBase64) => {
    await addBook(data, imageBase64);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 8 }}
        >
          <Text style={{ color: colors.primary, fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
        <Heading style={{ fontSize: 20, marginBottom: 6 }}>
          Agregar libro
        </Heading>
        <Body style={{ color: colors.textMuted }}>
          Rellena los datos y toca guardar.
        </Body>
      </View>

      <View style={{ flex: 1 }}>
        <BookForm onAdd={handleAdd} />
      </View>
    </SafeAreaView>
  );
}
