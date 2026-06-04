import { useState, useEffect, useCallback, useRef } from "react";
import { Platform } from "react-native";
import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

// ────────────────────────────────────────────────────────────────────────────
// Safe lazy loader for expo-notifications — Expo Go NO tiene módulos nativos.
// En vez de un import estático que crashea al bundlear, cargamos con require()
// envuelto en try/catch. Si falla (Expo Go), todo el feature de notificaciones
// se desactiva silenciosamente.
// ────────────────────────────────────────────────────────────────────────────
let Notifications = null;
let Device = null;

try {
  Notifications = require("expo-notifications");
  Device = require("expo-device");
} catch {
  console.log("useNotifications: expo-notifications no disponible (Expo Go)");
}

// ────────────────────────────────────────────────────────────────────────────
// Lazy init de los module-level side effects (setNotificationHandler, channels)
// ────────────────────────────────────────────────────────────────────────────
let _notificationsInitialized = false;
function ensureNotificationsInitialized() {
  if (_notificationsInitialized || !Notifications) return;
  _notificationsInitialized = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("loans", {
      name: "Préstamos",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E6F4FE",
      description: "Notificaciones de préstamos de libros",
    }).catch(() => {});
  }
}

// ────────────────────────────────────────────────────────────────────────────
// useNotificationResponse — hook que escucha taps en notificaciones
// y devuelve la data para navegar. Cubre:
//   - Cold start (getLastNotificationResponseAsync)
//   - Background → Foreground (addNotificationResponseReceivedListener)
//   - Tap en foreground
//
// Reemplaza: getInitialNotification + onNotificationOpenedApp + response listener
// ────────────────────────────────────────────────────────────────────────────
let lastNavigationData = null;
let navigationListeners = [];

function notifyNavigationListeners(data) {
  lastNavigationData = data;
  navigationListeners.forEach((fn) => fn(data));
}

export function useNotificationResponse() {
  const [navigationData, setNavigationData] = useState(lastNavigationData);

  useEffect(() => {
    if (lastNavigationData) {
      setNavigationData(lastNavigationData);
    }
    navigationListeners.push(setNavigationData);
    return () => {
      navigationListeners = navigationListeners.filter(
        (fn) => fn !== setNavigationData
      );
    };
  }, []);

  const clearNavigationData = useCallback(() => {
    lastNavigationData = null;
    setNavigationData(null);
  }, []);

  return { navigationData, clearNavigationData };
}

// ────────────────────────────────────────────────────────────────────────────
// useNotifications — hook principal
//
// NOTA sobre Expo Go:
//   - iOS: push notifications funcionan via Expo Push Service
//   - Android: push notifications NO están disponibles en Expo Go (SDK 53+).
//     Solo andan las notificaciones locales. Para push en Android necesitás
//     un development build (npx expo run:android).
// ────────────────────────────────────────────────────────────────────────────
export default function useNotifications() {
  const [fcmToken, setFcmToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const userIdRef = useRef(null);

  // Inicializar side effects si el módulo está disponible
  useEffect(() => {
    ensureNotificationsInitialized();
  }, []);

  /**
   * Obtiene un identificador único para este dispositivo.
   */
  const getDeviceId = useCallback(() => {
    if (Device?.deviceName) return Device.deviceName;
    return "default";
  }, []);

  /**
   * Guarda (o actualiza) el device token en Firestore.
   * Subcolección: users/{userId}/tokens/{deviceId}
   */
  const saveTokenToFirestore = useCallback(
    async (token, userId) => {
      if (!userId || !token) return;
      try {
        const deviceId = getDeviceId();
        const tokenRef = doc(db, "users", userId, "tokens", deviceId);
        await setDoc(tokenRef, {
          token,
          platform: Platform.OS,
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
   * Solicita permisos de notificación y registra el device token en Firestore.
   *
   * @param {string} userId - UID del usuario autenticado
   * @returns {Promise<string|null>} Device token o null si falla
   */
  const registerForPushNotifications = useCallback(
    async (userId) => {
      if (!Notifications) {
        console.log("useNotifications: Notifications module not available (Expo Go)");
        return null;
      }

      try {
        if (!Device?.isDevice) {
          console.log(
            "useNotifications: Push notifications require a physical device"
          );
          return null;
        }

        userIdRef.current = userId;

        // ── 1. Verificar/obtener permisos ──────────────────────────
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
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

        // ── 2. Obtener Expo Push Token ──────────────────────────────
        const expoProjectId = "d9fb3d85-ca52-43f7-b50b-aae7c8d42c26";
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: expoProjectId,
        });
        const token = tokenData?.data;

        if (!token) {
          console.log("useNotifications: Failed to obtain device token");
          return null;
        }

        setFcmToken(token);

        // ── 3. Guardar token en Firestore ──────────────────────────
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

  /**
   * Escucha cambios de token via Expo Notifications.
   */
  useEffect(() => {
    if (!Notifications) return;

    const subscription = Notifications.addPushTokenListener((tokenData) => {
      const newToken = tokenData?.data;
      if (newToken && newToken !== fcmToken) {
        console.log("useNotifications: Device token changed");
        setFcmToken(newToken);

        if (userIdRef.current) {
          saveTokenToFirestore(newToken, userIdRef.current);
        }
      }
    });

    return () => subscription.remove();
  }, [saveTokenToFirestore, fcmToken]);

  // ── Escuchar notificaciones recibidas en foreground ───────────
  useEffect(() => {
    if (!Notifications) return;

    const subscription = Notifications.addNotificationReceivedListener(
      (notif) => {
        setNotification(notif);
        const badgeCount =
          notif.request.content.data?._badgeCount ?? 1;
        Notifications.setBadgeCountAsync(badgeCount).catch(() => {});
      }
    );

    return () => subscription.remove();
  }, []);

  // ── Escuchar taps en notificaciones ──────────────────────────
  useEffect(() => {
    if (!Notifications) return;

    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data) {
          notifyNavigationListeners(data);
        }
      });

    return () => subscription.remove();
  }, []);

  // ── Revisar si la app se abrió desde una notificación (cold start) ─
  useEffect(() => {
    if (!Notifications) return;

    Notifications.getLastNotificationResponseAsync()
      .then((lastResponse) => {
        if (lastResponse?.notification?.request?.content?.data) {
          notifyNavigationListeners(
            lastResponse.notification.request.content.data
          );
        }
      })
      .catch(() => {});
  }, []);

  /**
   * Elimina el token de Firestore al cerrar sesión y limpia el badge.
   */
  const unregisterPushNotifications = useCallback(
    async (userId) => {
      try {
        if (!userId) return;

        userIdRef.current = null;

        const deviceId = getDeviceId();
        const tokenRef = doc(db, "users", userId, "tokens", deviceId);
        await deleteDoc(tokenRef);

        // Limpiar badge (si el módulo está disponible)
        if (Notifications) {
          await Notifications.setBadgeCountAsync(0);
        }

        setFcmToken(null);
        setNotification(null);
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
    notification,
    registerForPushNotifications,
    unregisterPushNotifications,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// showLocalNotification — muestra una notificación local inmediata.
//
// Se usa para:
//   - Recordatorios / alarmas locales
//   - Data push messages (sin alerta visual automática)
//   - Cualquier noti que quieras mostrar desde la propia app
//
// Las push notifications CON título/cuerpo se muestran automáticamente
// gracias a setNotificationHandler.
// ────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
// sendPushNotification — envía una notificación push via Expo Push API
//
// El token debe ser un Expo Push Token (ExponentPushToken[xxx]),
// que se obtiene con Notifications.getExpoPushTokenAsync().
//
// Los tokens se guardan en Firestore (users/{uid}/tokens/{deviceId})
// y se recuperan para enviar notificaciones específicas a cada usuario.
// ────────────────────────────────────────────────────────────────────────────
export async function sendPushNotification({ token, title, body, data = {} }) {
  if (!token) {
    console.warn("sendPushNotification: No token provided");
    return null;
  }

  const message = {
    to: token,
    sound: "default",
    title,
    body,
    data: {
      ...data,
      timestamp: new Date().toISOString(),
    },
    priority: "high",
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (!response.ok || result?.data?.status === "error") {
      console.error("sendPushNotification failed:", result);
      return null;
    }

    return result;
  } catch (error) {
    console.error("sendPushNotification error:", error);
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// showLocalNotification — muestra una notificación local inmediata.
// ────────────────────────────────────────────────────────────────────────────
export async function showLocalNotification({ title, body, data = {} }) {
  if (!Notifications) {
    console.log("showLocalNotification: Notifications module not available");
    return;
  }

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
