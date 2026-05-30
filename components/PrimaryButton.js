import React, { useRef, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
} from "react-native";
import { colors } from "./colors";

export function PrimaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = "primary", // "primary" or "secondary" or "danger"
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 300,
    }).start();
  }, [scaleAnim]);

  const buttonContent = () => {
    if (loading) {
      return <ActivityIndicator color={colors.surface} size="small" />;
    }
    return (
      <Text
        style={[
          styles.buttonText,
          textStyle,
          variant === "secondary" && styles.textSecondary,
          variant === "danger" && styles.textDanger,
        ]}
      >
        {title}
      </Text>
    );
  };

  const getButtonStyle = () => {
    if (variant === "danger")
      return [styles.button, styles.dangerButton, disabled && styles.disabled];
    if (variant === "secondary")
      return [
        styles.button,
        styles.secondaryButton,
        disabled && styles.disabled,
      ];
    return [styles.button, styles.primaryButton, style, disabled && styles.disabled];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[getButtonStyle(), { transform: [{ scale: scaleAnim }] }]}>
        {buttonContent()}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1.5,
  },
  dangerButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: -0.2,
  },
  textSecondary: {
    color: colors.textLight,
  },
  textDanger: {
    color: colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
});
