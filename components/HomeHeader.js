import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heading, Body } from ".";
import { colors } from "./colors";

export function HomeHeader({ user, onOpenMenu }) {
  const insets = useSafeAreaInsets();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const email = user ? user.email : null;
  const userName = email ? email.split("@")[0] : "Usuario";

  return (
    <View
      style={[
        {
          paddingHorizontal: 16,
          paddingTop: 16 + insets.top,
          paddingBottom: 12,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Heading style={{ fontSize: 16, color: colors.textMuted }}>
            {getGreeting()},
          </Heading>
          <Heading
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: colors.text,
              lineHeight: 32,
            }}
          >
            {userName}
          </Heading>
        </View>
        <TouchableOpacity
          onPress={onOpenMenu}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.text, fontSize: 20 }}>☰</Text>
        </TouchableOpacity>
      </View>
      <Body style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>
        {new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </Body>
      {/* Drawer menu contains the Cerrar sesión action */}
    </View>
  );
}

export default HomeHeader;
