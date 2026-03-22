import React from "react";
import { Text } from "react-native";

const weightToFont = {
  regular: "Poppins_400Regular",
  semi: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export default function AppText({
  children,
  size = 16,
  weight = "regular",
  style,
  ...props
}) {
  const fontFamily = weightToFont[weight] || weightToFont.regular;
  return (
    <Text style={[{ fontFamily, fontSize: size }, style]} {...props}>
      {children}
    </Text>
  );
}
