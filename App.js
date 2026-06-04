import { useRef, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RootNavigator } from "./stacks/";
import { useNotificationResponse } from "./hooks/useNotifications";
import useLoanNotifications from "./hooks/useLoanNotifications";

/**
 * Contenido interno de la app que vive DENTRO del AuthProvider.
 */
function AppContent() {
  const navigationRef = useRef(null);

  // ── Iniciar listener de notificaciones de préstamos ────────────
  // Escucha cambios en Firestore y envía push notifications
  // cuando se detectan transiciones de estado en los préstamos.
  useLoanNotifications();

  /**
   * useNotificationResponse — hook de Expo que centraliza el manejo
   * de taps en notificaciones, cubriendo:
   *   - Cold start (app terminada -> tap en noti -> abre)
   *   - Background -> Foreground (tap en noti)
   *   - Foreground (tap en noti mientras la app está abierta)
   *
   * Reemplaza: getInitialNotification + onNotificationOpenedApp
   */
  const { navigationData, clearNavigationData } = useNotificationResponse();

  /**
   * Navega a la pantalla correspondiente según los datos
   * de la notificación que el usuario tocó.
   */
  const handleNavigation = useCallback((data) => {
    if (!data?.screen) return;
    const nav = navigationRef.current;
    if (!nav) return;

    const screen = data.screen;
    const loanId = data.loanId || undefined;

    try {
      switch (screen) {
        case "AdminLoans":
          nav.navigate("AdminLoans", { loanId });
          break;

        case "MyLoans":
          nav.navigate("MisPrestamos", { loanId });
          break;

        case "LoanDetails":
          nav.navigate("Details", { loanId });
          break;

        default:
          break;
      }
    } catch (error) {
      console.warn("App: handleNavigation error:", error);
    }
  }, []);

  // ── Navegar cuando se recibe un tap en notificación ─────────────
  useEffect(() => {
    if (navigationData) {
      handleNavigation(navigationData);
      clearNavigationData();
    }
  }, [navigationData, handleNavigation, clearNavigationData]);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
