import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "./colors";

export function Body({ children, style, ...props }) {
  return (
    <Text style={[styles.body, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: "Poppins_400Regular",
  },
});

export default Body;
