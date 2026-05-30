import { useRef, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RootNavigator } from "./stacks/";
import { showLocalNotification } from "./hooks/useNotifications";

/**
 * FCM Background Message Handler.
 * DEBE estar registrado fuera del componente (top-level).
 * FCM ya muestra la notificación en la bandeja automáticamente
 * cuando el payload incluye "notification".
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("App: Background FCM message:", remoteMessage?.data);
});

/**
 * Contenido interno de la app que vive DENTRO del AuthProvider.
 */
function AppContent() {
  const navigationRef = useRef(null);

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

  // ── FCM Foreground: mostrar notificación local ──────────────────
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { notification, data } = remoteMessage;
      if (notification?.title || notification?.body) {
        await showLocalNotification({
          title: notification.title,
          body: notification.body,
          data: data || {},
        });
      }
    });

    return unsubscribe;
  }, []);

  // ── FCM Tap handlers (cold start + background→foreground) ──────
  useEffect(() => {
    // Cold start: la app se abrió al tocar una notificación
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data) {
          handleNavigation(remoteMessage.data);
        }
      })
      .catch((error) => {
        console.warn("App: getInitialNotification error:", error);
      });

    // Background → Foreground: usuario toca una notificación
    const unsubscribe = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        if (remoteMessage?.data) {
          handleNavigation(remoteMessage.data);
        }
      }
    );

    return unsubscribe;
  }, [handleNavigation]);

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
