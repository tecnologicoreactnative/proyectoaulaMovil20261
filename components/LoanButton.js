import React, { useState } from "react";
import { Alert, View } from "react-native";
import PrimaryButton from "./PrimaryButton";
import useLoans from "../hooks/useLoans";
import { useAuth } from "../contexts/AuthContext";

export default function LoanButton({ book }) {
  const { requestLoan, loading } = useLoans();
  const { user } = useAuth() || {};
  const [busy, setBusy] = useState(false);

  const handleRequest = async () => {
    if (!user) {
      Alert.alert(
        "Inicia sesión",
        "Debes iniciar sesión para solicitar préstamos.",
      );
      return;
    }
    if (!book || !book.id) {
      Alert.alert("Error", "Libro inválido");
      return;
    }

    setBusy(true);
    try {
      await requestLoan(book.id, user.uid);
      Alert.alert("Listo", "Préstamo solicitado correctamente.");
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo solicitar el préstamo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ marginTop: 12 }}>
      <PrimaryButton
        title={book && book.available ? "Solicitar préstamo" : "No disponible"}
        onPress={handleRequest}
        disabled={!book || !book.available}
        loading={loading || busy}
      />
    </View>
  );
}
