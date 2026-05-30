import { useState, useEffect, useCallback, useRef } from "react";
import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import messaging from "@react-native-firebase/messaging";
import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Configure behavior when a notification is received while the app is in foreground.
 * This is used when we display FCM notifications locally via scheduleNotificationAsync.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Hook principal para gestionar notificaciones push FCM en Leero.
 *
 * Responsabilidades:
 * - Solicitar permisos de notificación (Android 13+)
 * - Obtener y registrar el FCM token en Firestore
 * - Escuchar refrescos de token FCM
 * - Limpiar tokens al cerrar sesión
 * - Crear el canal de notificaciones de préstamos en Android
 *
 * NOTA: El envío de notificaciones se hace SERVER-SIDE vía Firebase Cloud Functions.
 * Este hook solo se encarga del lado cliente (token + permisos + display).
 */
export default function useNotifications() {
  const [fcmToken, setFcmToken] = useState(null);
  const userIdRef = useRef(null);

  /**
   * Obtiene un identificador único para este dispositivo.
   */
  const getDeviceId = useCallback(() => {
    if (Device?.deviceName) return Device.deviceName;
    return "default";
  }, []);

  /**
   * Guarda (o actualiza) el FCM token en Firestore.
   */
  const saveTokenToFirestore = useCallback(
    async (token, userId) => {
      if (!userId || !token) return;
      try {
        const deviceId = getDeviceId();
        const tokenRef = doc(db, "users", userId, "tokens", deviceId);
        await setDoc(tokenRef, {
          token,
          platform: "android",
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error(
          "useNotifications: saveTokenToFirestore error:",
          error
        );
      }
    },
    [getDeviceId]
  );

  /**
   * Solicita permisos y registra el FCM token en Firestore.
   *
   * @param {string} userId - UID del usuario autenticado
   * @returns {Promise<string|null>} FCM token o null si falla
   */
  const registerForPushNotifications = useCallback(
    async (userId) => {
      try {
        if (!Device.isDevice) {
          console.log(
            "useNotifications: Push notifications require a physical device"
          );
          return null;
        }

        // Guardar userId para el handler de refresh
        userIdRef.current = userId;

        // ── 1. Verificar/obtener permisos ──────────────────────────
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          Alert.alert(
            "Notificaciones",
            "Para recibir alertas sobre el estado de tus préstamos, necesitamos enviarte notificaciones. ¿Nos permites?"
          );
          const { status } = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
            },
          });
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log(
            "useNotifications: Push notification permission denied"
          );
          return null;
        }

        // ── 2. Crear canal de notificaciones en Android ────────────
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("loans", {
            name: "Préstamos",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#E6F4FE",
            description: "Notificaciones de préstamos de libros",
          });
        }

        // ── 3. Obtener FCM token via @react-native-firebase/messaging ─
        const token = await messaging().getToken();

        if (!token) {
          console.log("useNotifications: Failed to obtain FCM token");
          return null;
        }

        setFcmToken(token);

        // ── 4. Guardar token en Firestore ──────────────────────────
        await saveTokenToFirestore(token, userId);

        return token;
      } catch (error) {
        console.error(
          "useNotifications: registerForPushNotifications error:",
          error
        );
        return null;
      }
    },
    [saveTokenToFirestore]
  );

  // ── Escuchar refrescos de FCM token ─────────────────────────────
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
      console.log("useNotifications: FCM token refreshed");
      setFcmToken(newToken);

      // Re-guardar el token actualizado en Firestore
      if (userIdRef.current) {
        await saveTokenToFirestore(newToken, userIdRef.current);
      }
    });

    return unsubscribe;
  }, [saveTokenToFirestore]);

  /**
   * Elimina el token de Firestore al cerrar sesión.
   *
   * @param {string} userId - UID del usuario que cierra sesión
   */
  const unregisterPushNotifications = useCallback(
    async (userId) => {
      try {
        if (!userId) return;

        userIdRef.current = null;

        const deviceId = getDeviceId();
        const tokenRef = doc(db, "users", userId, "tokens", deviceId);
        await deleteDoc(tokenRef);

        // Limpiar badge
        await Notifications.setBadgeCountAsync(0);

        setFcmToken(null);
      } catch (error) {
        console.error(
          "useNotifications: unregisterPushNotifications error:",
          error
        );
      }
    },
    [getDeviceId]
  );

  return {
    fcmToken,
    registerForPushNotifications,
    unregisterPushNotifications,
  };
}

/**
 * Muestra una notificación local inmediata usando expo-notifications.
 * Se usa para notificaciones FCM recibidas en foreground.
 *
 * @param {Object} params
 * @param {string} params.title - Título de la notificación
 * @param {string} params.body - Cuerpo de la notificación
 * @param {Object} [params.data] - Datos adicionales (deep linking, etc.)
 */
export async function showLocalNotification({ title, body, data = {} }) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
        },
        sound: "default",
        ...(Platform.OS === "android" && { channelId: "loans" }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  } catch (error) {
    console.warn("showLocalNotification error:", error);
  }
}
