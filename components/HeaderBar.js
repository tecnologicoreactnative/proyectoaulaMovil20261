import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./colors";
import { useAuth } from "../contexts/AuthContext";
import MenuModal from "./MenuModal";

export default function HeaderBar({ title, showBackButton = true }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const displayTitle = title || route.name;
  const canGoBack = navigation.canGoBack() && showBackButton;

  const headerStyle = {
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: insets.top + 8,
    paddingBottom: 8,
    minHeight: 56 + insets.top,
  };

  return (
    <>
      <View style={headerStyle}>
        {canGoBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{displayTitle}</Text>
        {user && (
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.text,
  },
});
