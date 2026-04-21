import React from "react";
import LoginForm from "../components/auth/LoginForm";

export default function Login({ navigation }) {
  return (
    <LoginForm
      onSuccess={() => {}}
      onSwitchToRegister={() => navigation.navigate("Register")}
    />
  );
}
