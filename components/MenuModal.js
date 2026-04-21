import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "./colors";
import { useAuth } from "../contexts/AuthContext";

const { height } = Dimensions.get("window");

export default function MenuModal({ visible, onClose }) {
  const navigation = useNavigation();
  const { signOut, user } = useAuth();
  const insets = useSafeAreaInsets();
  
  // Start from off-screen top
  const slideAnim = useRef(new Animated.Value(-height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNavigate = (route) => {
    navigation.navigate(route);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateY: slideAnim }],
              paddingTop: insets.top + 20,
              paddingBottom: 24, // Space for the curved bottom
            },
          ]}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Cuenta</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <TouchableOpacity
              onPress={() => handleNavigate("MisPrestamos")}
              style={styles.item}
            >
              <Text style={styles.itemText}>Mis Préstamos</Text>
            </TouchableOpacity>

            {user?.role === "admin" && (
              <>
                <Text style={styles.sectionTitle}>Administración</Text>
                <TouchableOpacity
                  onPress={() => handleNavigate("AdminBooks")}
                  style={styles.item}
                >
                  <Text style={styles.itemText}>Gestión de Libros</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleNavigate("AdminLoans")}
                  style={styles.item}
                >
                  <Text style={styles.itemText}>Gestión de Préstamos</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                signOut();
                onClose && onClose();
              }}
              style={styles.item}
            >
              <Text style={[styles.itemText, { color: colors.error }]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.item}>
              <Text style={[styles.itemText, { color: colors.primary }]}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0, // Makes it stretch edge to edge
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 24, // Curved bottom 
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: 10,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
});
