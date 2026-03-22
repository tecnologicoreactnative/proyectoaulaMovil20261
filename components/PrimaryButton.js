import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { colors } from "./colors";

export function PrimaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
}) {
  const buttonContent = () => {
    if (loading) {
      return <ActivityIndicator color={colors.text} size="small" />;
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

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0.05,
  },
});
