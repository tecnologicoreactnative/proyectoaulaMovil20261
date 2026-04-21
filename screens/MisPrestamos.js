import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HeaderBar from "../components/HeaderBar";
import ActiveLoansList from "../components/loans/ActiveLoansList";
import LoanHistoryList from "../components/loans/LoanHistoryList";
import { colors } from "../components/colors";

// Mis Prestamos screen: purely composes presentational components
export default function MisPrestamos({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <HeaderBar title="Mis Préstamos" navigation={navigation} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section - Compact */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="book" size={28} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Mis Préstamos</Text>
          <Text style={styles.heroSubtitle}>
            Gestiona tus libros
          </Text>
        </View>

        {/* Components */}
        <ActiveLoansList />
        <LoanHistoryList />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 8,
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});