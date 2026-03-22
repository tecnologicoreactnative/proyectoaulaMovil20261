import React, { useState } from "react";
import { ScrollView, View, TextInput, Alert } from "react-native";
import { Heading, Body, PrimaryButton } from "../components";
import useAuthActions from "../hooks/useAuthActions";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp } = useAuthActions();

  const handleSignUp = () => {
    if (!email || !password) return Alert.alert("Error", "Completa los campos");
    signUp(email, password)
      .then(() => {})
      .catch((error) => Alert.alert("Error", error.message));
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

      <PrimaryButton title="Registrarse" onPress={handleSignUp} />

      <View style={{ marginTop: 12 }}>
        <Body
          style={{ textAlign: "center" }}
          onPress={() => navigation.navigate("Login")}
        >
          ¿Ya tienes cuenta? Iniciar sesión
        </Body>
      </View>
    </ScrollView>
  );
}
