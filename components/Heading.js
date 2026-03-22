import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "./colors";

export function Heading({ children, style, ...props }) {
  return (
    <Text style={[styles.heading, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default Heading;
