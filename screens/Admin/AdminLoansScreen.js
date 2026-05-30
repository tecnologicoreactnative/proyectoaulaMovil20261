import React from "react";
import { View } from "react-native";
import HeaderBar from "../../components/HeaderBar";
import { colors } from "../../components/colors";
import AdminLoansList from "../../components/admin/AdminLoansList";

/**
 * Screen: Administración de préstamos
 * Solo composición de componentes - sin lógica de negocio
 */
export default function AdminLoansScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <HeaderBar title="Gestión de Préstamos" showBackButton={true} />
      <AdminLoansList />
    </View>
  );
}
