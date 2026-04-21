import React, { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import PrimaryButton from "./PrimaryButton";
import useLoans from "../hooks/useLoans";
import { useAuth } from "../contexts/AuthContext";

// Loan states
const STATES = {
  REQUESTED: "solicitado",
  APPROVED: "aprobado",
  DELIVERED: "entregado",
  RETURNED: "devuelto",
  CANCELLED: "cancelado",
};

export default function LoanButton({ book }) {
  const { requestLoan, cancelLoan, loading, userLoans, subscribeToUserLoans } = useLoans();
  const { user } = useAuth() || {};
  const [busy, setBusy] = useState(false);
  const [activeLoan, setActiveLoan] = useState(null);

  // Subscribe to user's loans to check for active loan on this book
  useEffect(() => {
    if (!user?.uid || !book?.id) return;
    const unsubscribe = subscribeToUserLoans(user.uid);
    return () => unsubscribe && unsubscribe();
  }, [user?.uid, book?.id]);

  // Find if user has active loan for this book
  useEffect(() => {
    if (!userLoans || !book?.id) {
      setActiveLoan(null);
      return;
    }
    const loan = userLoans.find(
      (l) => l.bookId === book.id && 
      (l.status === STATES.REQUESTED || l.status === STATES.APPROVED || l.status === STATES.DELIVERED)
    );
    setActiveLoan(loan || null);
  }, [userLoans, book?.id]);

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

    // If there's an active loan, user can cancel it
    if (activeLoan) {
      if (activeLoan.status === STATES.REQUESTED || activeLoan.status === STATES.APPROVED) {
        Alert.alert(
          "Cancelar solicitud",
          "¿Estás seguro de que quieres cancelar esta solicitud de préstamo?",
          [
            { text: "No", style: "cancel" },
            { 
              text: "Sí, cancelar", 
              style: "destructive",
              onPress: async () => {
                setBusy(true);
                try {
                  await cancelLoan(activeLoan.id);
                  Alert.alert("Listo", "Solicitud cancelada correctamente.");
                } catch (e) {
                  Alert.alert("Error", e.message || "No se pudo cancelar la solicitud");
                } finally {
                  setBusy(false);
                }
              }
            },
          ]
        );
        return;
      }
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

  // Determine button state
  const hasActiveLoan = !!activeLoan;
  const canCancel = hasActiveLoan && (activeLoan.status === STATES.REQUESTED || activeLoan.status === STATES.APPROVED);
  const isDelivered = hasActiveLoan && activeLoan.status === STATES.DELIVERED;

  let buttonTitle = "Solicitar préstamo";
  let buttonDisabled = !book || !book.available;

  if (isDelivered) {
    buttonTitle = "Entregado";
    buttonDisabled = true;
  } else if (canCancel) {
    buttonTitle = "Cancelar solicitud";
    buttonDisabled = false;
  } else if (hasActiveLoan && activeLoan.status === STATES.RETURNED) {
    buttonTitle = "Devuelto";
    buttonDisabled = true;
  }

  return (
    <View style={{ marginTop: 12 }}>
      <PrimaryButton
        title={buttonTitle}
        onPress={handleRequest}
        disabled={buttonDisabled}
        loading={loading || busy}
        variant={canCancel ? "secondary" : "primary"}
      />
    </View>
  );
}
