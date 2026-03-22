import React from "react";
import { View, ScrollView, Image } from "react-native";
import { Card, Heading, Body } from "../components";
import LoanButton from "../components/LoanButton";

export default function Details({ route }) {
  const { book } = route.params || {};

  if (!book) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Body>No hay detalles para este libro.</Body>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Card style={{ overflow: "hidden" }}>
        {book.image ? (
          <Image
            source={{ uri: book.image }}
            style={{ width: "100%", height: 380 }}
            resizeMode="cover"
          />
        ) : null}
        <View style={{ padding: 12 }}>
          <Heading>{book.title}</Heading>
          <Body style={{ marginTop: 8 }}>{book.author}</Body>
          {/* Availability */}
          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <View
              style={{
                backgroundColor: book.available ? "#10B981" : "#EF4444",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
                alignSelf: "flex-start",
              }}
            >
              <Body style={{ color: "#ffffff", fontWeight: "700" }}>
                {book.available ? "Disponible" : "No disponible"}
              </Body>
            </View>
          </View>
          <Body style={{ marginTop: 12 }}>{book.description}</Body>
          <LoanButton book={book} />
        </View>
      </Card>
    </ScrollView>
  );
}
