import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import useAuthActions from "../../hooks/useAuthActions";
import { colors } from "../colors";

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuthActions();

  const handleSignIn = async () => {
    if (!email || !password) {
      return Alert.alert("Campos incompletos", "Por favor completa todos los campos");
    }

    setLoading(true);
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setLoading(false);
        return Alert.alert(
          "Sin conexión",
          "Revisa tu conexión a Internet e intenta de nuevo.",
        );
      }

      await signIn(email, password);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert(
        "Error",
        error.message || "Ocurrió un problema al iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="library" size={60} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>Biblioteca TDEA</Text>
          <Text style={styles.appSubtitle}>Tu biblioteca digital personal</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Bienvenido de nuevo</Text>
          <Text style={styles.formSubtitle}>Ingresa a tu cuenta</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Ionicons name="mail-outline" size={16} color={colors.textMuted} />
              <Text style={styles.inputLabelText}>Correo electrónico</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="tu@email.com"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
              <Text style={styles.inputLabelText}>Contraseña</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color={colors.surface} />
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
              <Text style={styles.registerLink}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 4,
  },
  formSection: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  inputLabelText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textLight,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  eyeButton: {
    padding: 14,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  registerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});