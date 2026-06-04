import { useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { STATES } from "../constants/loans";
import { sendPushNotification } from "./useNotifications";

// ────────────────────────────────────────────────────────────────────────────
// Cache simple de nombres/ títulos para evitar lecturas repetidas a Firestore
// ────────────────────────────────────────────────────────────────────────────
const cache = {};

async function getUserName(userId) {
  if (!userId) return "Usuario";
  if (cache[userId]) return cache[userId];

  try {
    const q = query(collection(db, "users"), where("__name__", "==", userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data();
      const name =
        `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
        data.email ||
        "Usuario";
      cache[userId] = name;
      return name;
    }
  } catch (e) {
    console.error("getUserName error:", e);
  }
  return "Usuario";
}

async function getBookTitle(bookId) {
  if (!bookId) return "Libro";
  const key = `book_${bookId}`;
  if (cache[key]) return cache[key];

  try {
    const q = query(collection(db, "books"), where("__name__", "==", bookId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const title = snap.docs[0].data().title || "Libro";
      cache[key] = title;
      return title;
    }
  } catch (e) {
    console.error("getBookTitle error:", e);
  }
  return "Libro";
}

async function getUserTokens(userId) {
  if (!userId) return [];
  try {
    const tokensRef = collection(db, "users", userId, "tokens");
    const snap = await getDocs(tokensRef);
    return snap.docs.map((d) => d.data().token).filter(Boolean);
  } catch (e) {
    console.error("getUserTokens error:", e);
    return [];
  }
}

async function getAdminTokens() {
  try {
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const snap = await getDocs(q);
    const tokens = [];

    for (const userDoc of snap.docs) {
      const tokensRef = collection(db, "users", userDoc.id, "tokens");
      const tokensSnap = await getDocs(tokensRef);
      tokensSnap.docs.forEach((t) => {
        const token = t.data().token;
        if (token) tokens.push(token);
      });
    }

    return tokens;
  } catch (e) {
    console.error("getAdminTokens error:", e);
    return [];
  }
}

// ────────────────────────────────────────────────────────────────────────────
// useLoanNotifications
//
// Hook de solo-efectos que se suscribe a TODOS los préstamos y dispara
// notificaciones push cuando detecta transiciones de estado.
//
// Usa los Expo Push Tokens guardados en Firestore
// (users/{uid}/tokens/{deviceId}) para saber a quién notificar.
// ────────────────────────────────────────────────────────────────────────────
export default function useLoanNotifications() {
  const previousLoansRef = useRef({});
  const initializedRef = useRef(false);
  const adminTokensRef = useRef([]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // ── Cargar tokens de admin al montar ──────────────────────────
    getAdminTokens().then((tokens) => {
      adminTokensRef.current = tokens;
    });

    // ── Refrescar tokens de admin cada 5 min ──────────────────────
    const refreshInterval = setInterval(async () => {
      adminTokensRef.current = await getAdminTokens();
    }, 5 * 60 * 1000);

    // ── Suscribirse a TODOS los préstamos ─────────────────────────
    const unsub = onSnapshot(
      collection(db, "loans"),
      (snap) => {
        const currentLoans = {};

        snap.docChanges().forEach((change) => {
          const data = change.doc.data();
          const loanId = change.doc.id;

          currentLoans[loanId] = {
            id: loanId,
            status: data.status,
            borrowerId: data.borrowerId,
            bookId: data.bookId,
          };

          // Solo nos interesan modificaciones (no create ni remove)
          if (change.type === "modified") {
            const previous = previousLoansRef.current[loanId];
            if (previous && previous.status !== data.status) {
              handleLoanTransition({
                id: loanId,
                status: data.status,
                borrowerId: data.borrowerId,
                bookId: data.bookId,
                previousStatus: previous.status,
                adminTokens: adminTokensRef.current,
              });
            }
          }
        });

        previousLoansRef.current = currentLoans;
      },
      (error) => {
        console.error("useLoanNotifications: onSnapshot error:", error);
      }
    );

    return () => {
      clearInterval(refreshInterval);
      if (unsub) unsub();
    };
  }, []);
}

// ────────────────────────────────────────────────────────────────────────────
// handleLoanTransition — detecta el tipo de transición y envía las
// notificaciones correspondientes.
//
// Cada caso usa los tokens guardados en Firestore para dirigir
// la notificación a la persona correcta.
// ────────────────────────────────────────────────────────────────────────────
async function handleLoanTransition({
  id: loanId,
  status,
  borrowerId,
  bookId,
  previousStatus,
  adminTokens,
}) {
  // Ignorar transiciones no definidas
  if (!previousStatus || !status) return;

  // Obtener datos para personalizar los mensajes
  const [borrowerName, bookTitle] = await Promise.all([
    getUserName(borrowerId),
    getBookTitle(bookId),
  ]);

  const transitionKey = `${previousStatus}-${status}`;

  switch (transitionKey) {
    // ── SOLICITUD NUEVA: (null/undefined) → solicitado ───────────
    // ── O: un admin crea un préstamo directamente ─────────────────
    case `${STATES.REQUESTED}-${STATES.REQUESTED}`:
    // Ya estaba en solicitado — skip (primera carga)
    break;

    // ── NUEVA SOLICITUD → notificar a todos los admins ────────────
    case `null-${STATES.REQUESTED}`:
    case `undefined-${STATES.REQUESTED}`: {
      for (const token of adminTokens) {
        sendPushNotification({
          token,
          title: "Nueva solicitud de préstamo",
          body: `${borrowerName} solicitó: ${bookTitle}`,
          data: {
            type: "loan_status_change",
            loanId,
            newStatus: STATES.REQUESTED,
            screen: "AdminLoans",
          },
        });
      }
      break;
    }

    // ── APROBADO → notificar al prestatario ───────────────────────
    case `${STATES.REQUESTED}-${STATES.APPROVED}`: {
      const userTokens = await getUserTokens(borrowerId);
      for (const token of userTokens) {
        sendPushNotification({
          token,
          title: "Préstamo aprobado",
          body: `"${bookTitle}" fue aprobado. ¡Ya podés retirarlo!`,
          data: {
            type: "loan_status_change",
            loanId,
            newStatus: STATES.APPROVED,
            screen: "MyLoans",
          },
        });
      }
      break;
    }

    // ── ENTREGADO → notificar al prestatario ──────────────────────
    case `${STATES.APPROVED}-${STATES.DELIVERED}`: {
      const userTokens = await getUserTokens(borrowerId);
      for (const token of userTokens) {
        sendPushNotification({
          token,
          title: "Libro retirado",
          body: `Retiraste "${bookTitle}". Tenés 14 días para devolverlo.`,
          data: {
            type: "loan_status_change",
            loanId,
            newStatus: STATES.DELIVERED,
            screen: "MyLoans",
          },
        });
      }
      break;
    }

    // ── DEVUELTO → notificar al prestatario ───────────────────────
    case `${STATES.DELIVERED}-${STATES.RETURNED}`: {
      const userTokens = await getUserTokens(borrowerId);
      for (const token of userTokens) {
        sendPushNotification({
          token,
          title: "Devolución registrada",
          body: `Devolviste "${bookTitle}". ¡Gracias!`,
          data: {
            type: "loan_status_change",
            loanId,
            newStatus: STATES.RETURNED,
            screen: "MyLoans",
          },
        });
      }
      break;
    }

    // ── CANCELADO (desde solicitado) → notificar a admins ─────────
    case `${STATES.REQUESTED}-${STATES.CANCELLED}`: {
      for (const token of adminTokens) {
        sendPushNotification({
          token,
          title: "Solicitud cancelada",
          body: `${borrowerName} canceló la solicitud de: ${bookTitle}`,
          data: {
            type: "loan_status_change",
            loanId,
            newStatus: STATES.CANCELLED,
            screen: "AdminLoans",
          },
        });
      }
      break;
    }

    // ── CANCELADO (desde aprobado) → notificar al prestatario ─────
    case `${STATES.APPROVED}-${STATES.CANCELLED}`: {
      const userTokens = await getUserTokens(borrowerId);
      for (const token of userTokens) {
        sendPushNotification({
          token,
          title: "Préstamo cancelado",
          body: `Tu préstamo de "${bookTitle}" fue cancelado`,
          data: {
            type: "loan_status_change",
            loanId,
            newStatus: STATES.CANCELLED,
            screen: "MyLoans",
          },
        });
      }
      break;
    }

    default:
      // Transición no manejada — log para debugging
      console.log(
        `useLoanNotifications: transición no manejada: ${transitionKey}`
      );
      break;
  }
}
