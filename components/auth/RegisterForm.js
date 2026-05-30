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
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import useAuthActions from "../../hooks/useAuthActions";
import { colors } from "../colors";

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuthActions();

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName || !birthDate) {
      return Alert.alert("Campos incompletos", "Por favor completa todos los campos");
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return Alert.alert("Nombre inválido", "Nombre y apellido deben tener al menos 2 caracteres");
    }

    // Validate age
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (isNaN(birthDate.getTime()) || age < 5 || age > 120) {
      return Alert.alert("Fecha inválida", "La edad debe estar entre 5 y 120 años");
    }

    const birthDateStr = formatDateForAPI(birthDate);

    setLoading(true);
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        setLoading(false);
        return Alert.alert("Sin conexión", "Revisa tu conexión a Internet");
      }

      await signUp(email, password, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate: birthDateStr,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert("Error", error.message || "Error al registrarse");
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
            <Ionicons name="person-add" size={50} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>Crear Cuenta</Text>
          <Text style={styles.appSubtitle}>Únete a la biblioteca digital</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Regístrate</Text>
          <Text style={styles.formSubtitle}>Completa tus datos</Text>

          {/* Name Row */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <View style={styles.inputLabel}>
                <Ionicons name="person-outline" size={14} color={colors.textMuted} />
                <Text style={styles.inputLabelText}>Nombre</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Juan"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.halfInput}>
              <View style={styles.inputLabel}>
                <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                <Text style={styles.inputLabelText}>Apellido</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Pérez"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          {/* Birth Date Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
              <Text style={styles.inputLabelText}>Fecha de nacimiento</Text>
            </View>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={birthDate ? styles.dateText : styles.datePlaceholder}>
                {birthDate ? formatDateDisplay(birthDate) : "Seleccionar fecha"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* DateTimePicker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={birthDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
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
              <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
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
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <>
                <Ionicons name="person-add-outline" size={18} color={colors.surface} />
                <Text style={styles.registerButtonText}>Crear cuenta</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.loginLink}>Iniciar sesión</Text>
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
    marginBottom: 28,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary + "12",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  appSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 22,
  },
  formSection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
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
    letterSpacing: -0.2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  eyeButton: {
    padding: 14,
  },
  registerButton: {
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
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  loginText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  datePlaceholder: {
    fontSize: 16,
    color: colors.textMuted,
  },
});