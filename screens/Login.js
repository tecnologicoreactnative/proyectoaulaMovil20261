import React, { useState } from "react";
import { ScrollView, View, TextInput, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Heading, Body, PrimaryButton } from "../components";
import useAuthActions from "../hooks/useAuthActions";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuthActions();

  const handleSignIn = async () => {
    if (!email || !password) return Alert.alert("Error", "Completa los campos");

    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        return Alert.alert(
          "Sin conexión",
          "Revisa tu Internet e intenta de nuevo.",
        );
      }

      await signIn(email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert(
        "Error",
        error.message || "Ocurrió un problema al iniciar sesión",
      );
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "#ffffff",
        flexGrow: 1,
        justifyContent: "center",
      }}
    >
      <Heading style={{ marginBottom: 6 }}>Correo electrónico</Heading>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 12,
          borderColor: "#dfeee0",
          borderRadius: 8,
        }}
      />

      <Heading style={{ marginBottom: 6 }}>Contraseña</Heading>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 18,
          borderColor: "#dfeee0",
          borderRadius: 8,
        }}
      />

      <PrimaryButton title="Iniciar sesión" onPress={handleSignIn} />

      <View style={{ marginTop: 12 }}>
        <Body
          style={{ textAlign: "center", marginTop: 12 }}
          onPress={() => navigation.navigate("Register")}
        >
          Crear cuenta
        </Body>
      </View>
    </ScrollView>
  );
}
