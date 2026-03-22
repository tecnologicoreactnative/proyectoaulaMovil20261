import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { colors } from "./colors";

export function GradientButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
}) {
  const buttonContent = () => {
    if (loading) {
      return <ActivityIndicator color={colors.surface} size="small" />;
    }
    return <Text style={[styles.buttonText, textStyle]}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={[styles.button, style, disabled && styles.disabled]}>
        {buttonContent()}
      </View>
    </TouchableOpacity>
  );
}

export default GradientButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
});
