import { useState, useCallback, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useLoans, { STATES } from "./useLoans";
import useBooks from "./useBooks";

/**
 * Hook de administración de préstamos
 * - Suscripción en tiempo real a TODOS los préstamos (sin filtro de usuario)
 * - Enriquecimiento con datos de libro (useBooks) y usuario (getDocs)
 * - Estadísticas por estado y filtro por estado
 * - Acciones con confirmación Alert y feedback al usuario
 *
 * Sigue el patrón de Clean Architecture: Screen → Hook → Firebase
 * Inspirado en useAdminBooks.js para consistencia
 */
export default function useAdminLoans() {
  // ── Hooks base ──────────────────────────────────────────────────
  const { books } = useBooks();
  const {
    approveLoan: baseApproveLoan,
    markDelivered: baseMarkDelivered,
    markReturned: baseMarkReturned,
    cancelLoan: baseCancelLoan,
  } = useLoans();

  // ── Estado local ────────────────────────────────────────────────
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState({});
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [filterUserId, setFilterUserId] = useState(null);

  // ── 1. Fetch ALL users on mount (una sola vez) ──────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const map = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          const firstName = data.firstName || "";
          const lastName = data.lastName || "";
          map[d.id] = {
            uid: d.id,
            email: data.email || "",
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`.trim() || data.email || "",
            delayCount: data.delayCount || 0,
            penaltyUntil: data.penaltyUntil || null,
          };
        });
        setUserMap(map);
      } catch (err) {
        console.error("useAdminLoans: error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  // ── 2. Subscribe to ALL loans en tiempo real ────────────────────
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "loans"),
      (snap) => {
        try {
          const items = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              bookId: data.bookId || null,
              borrowerId: data.borrowerId || null,
              status: data.status || STATES.REQUESTED,
              requestedAt: data.requestedAt?.toDate
                ? data.requestedAt.toDate()
                : null,
              approvedAt: data.approvedAt?.toDate
                ? data.approvedAt.toDate()
                : null,
              deliveredAt: data.deliveredAt?.toDate
                ? data.deliveredAt.toDate()
                : null,
              maxReturnDate: data.maxReturnDate?.toDate
                ? data.maxReturnDate.toDate()
                : null,
              returnedAt: data.returnedAt?.toDate
                ? data.returnedAt.toDate()
                : null,
              cancelledAt: data.cancelledAt?.toDate
                ? data.cancelledAt.toDate()
                : null,
            };
          });
          setLoans(items);
        } catch (err) {
          console.error("useAdminLoans: error processing snapshot", err);
          setLoans([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("useAdminLoans: onSnapshot error", err);
        setLoans([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // ── 3. Build book map desde useBooks ────────────────────────────
  const bookMap = useMemo(() => {
    const map = {};
    (books || []).forEach((b) => {
      map[b.id] = { title: b.title, author: b.author, image: b.image };
    });
    return map;
  }, [books]);

  // ── 4. Enrich loans con datos de libro y usuario ────────────────
  const allLoans = useMemo(() => {
    return (loans || []).map((loan) => ({
      ...loan,
      book: bookMap[loan.bookId] || null,
      borrower: userMap[loan.borrowerId] || null,
    }));
  }, [loans, bookMap, userMap]);

  // ── 5. Derive filtered loans según filterStatus, date range, user ─────
  const filteredLoans = useMemo(() => {
    let result = allLoans;

    // Status filter
    if (filterStatus) {
      result = result.filter((loan) => loan.status === filterStatus);
    }

    // Date range filter
    if (filterDateFrom) {
      result = result.filter(
        (loan) =>
          loan.requestedAt &&
          loan.requestedAt.getTime() >= filterDateFrom.getTime()
      );
    }
    if (filterDateTo) {
      result = result.filter(
        (loan) =>
          loan.requestedAt &&
          loan.requestedAt.getTime() <= filterDateTo.getTime()
      );
    }

    // User filter
    if (filterUserId) {
      result = result.filter((loan) => loan.borrowerId === filterUserId);
    }

    return result;
  }, [allLoans, filterStatus, filterDateFrom, filterDateTo, filterUserId]);

  // ── 6. Compute stats por estado usando reduce ───────────────────
  const stats = useMemo(() => {
    const initial = {
      solicitado: 0,
      aprobado: 0,
      entregado: 0,
      devuelto: 0,
      cancelado: 0,
      total: 0,
    };
    return (loans || []).reduce((acc, loan) => {
      switch (loan.status) {
        case STATES.REQUESTED:
          acc.solicitado += 1;
          break;
        case STATES.APPROVED:
          acc.aprobado += 1;
          break;
        case STATES.DELIVERED:
          acc.entregado += 1;
          break;
        case STATES.RETURNED:
          acc.devuelto += 1;
          break;
        case STATES.CANCELLED:
          acc.cancelado += 1;
          break;
      }
      acc.total += 1;
      return acc;
    }, initial);
  }, [loans]);

  // ── 7. Actions con confirmación y feedback ──────────────────────

  /**
   * Aprueba un préstamo.
   * Valida que el usuario no tenga penalización activa antes de confirmar.
   */
  const approveLoan = useCallback(
    (loanId) => {
      if (!loanId) {
        Alert.alert("Error", "ID de préstamo inválido");
        return;
      }

      // Validar penalización activa del prestatario (Req-006 / Esc-009)
      const loan = loans.find((l) => l.id === loanId);
      if (loan) {
        const borrower = userMap[loan.borrowerId];
        if (borrower?.penaltyUntil) {
          const penaltyDate = borrower.penaltyUntil?.toDate
            ? borrower.penaltyUntil.toDate()
            : new Date(borrower.penaltyUntil);
          if (penaltyDate > new Date()) {
            Alert.alert(
              "Penalización activa",
              "El usuario tiene una penalización vigente. No se puede aprobar el préstamo."
            );
            return;
          }
        }
      }

      Alert.alert(
        "Aprobar préstamo",
        "¿Estás seguro de aprobar este préstamo?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Aprobar",
            onPress: async () => {
              try {
                await baseApproveLoan(loanId);
                Alert.alert("Éxito", "Préstamo aprobado correctamente");
              } catch (err) {
                Alert.alert(
                  "Error",
                  err.message || "No se pudo aprobar el préstamo"
                );
              }
            },
          },
        ]
      );
    },
    [baseApproveLoan, loans, userMap]
  );

  /**
   * Marca un préstamo como entregado.
   */
  const markDelivered = useCallback(
    (loanId) => {
      if (!loanId) {
        Alert.alert("Error", "ID de préstamo inválido");
        return;
      }
      Alert.alert(
        "Marcar como entregado",
        "¿Estás seguro de marcar este préstamo como entregado?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Entregado",
            onPress: async () => {
              try {
                await baseMarkDelivered(loanId);
                Alert.alert("Éxito", "Préstamo marcado como entregado");
              } catch (err) {
                Alert.alert(
                  "Error",
                  err.message || "No se pudo marcar como entregado"
                );
              }
            },
          },
        ]
      );
    },
    [baseMarkDelivered]
  );

  /**
   * Marca un préstamo como devuelto.
   */
  const markReturned = useCallback(
    (loanId) => {
      if (!loanId) {
        Alert.alert("Error", "ID de préstamo inválido");
        return;
      }
      Alert.alert(
        "Marcar como devuelto",
        "¿Estás seguro de marcar este préstamo como devuelto?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Devuelto",
            onPress: async () => {
              try {
                await baseMarkReturned(loanId);
                Alert.alert("Éxito", "Préstamo marcado como devuelto");
              } catch (err) {
                Alert.alert(
                  "Error",
                  err.message || "No se pudo marcar como devuelto"
                );
              }
            },
          },
        ]
      );
    },
    [baseMarkReturned]
  );

  /**
   * Cancela un préstamo (solo estados solicitado/aprobado).
   */
  const cancelLoan = useCallback(
    (loanId) => {
      if (!loanId) {
        Alert.alert("Error", "ID de préstamo inválido");
        return;
      }
      Alert.alert(
        "Cancelar préstamo",
        "¿Estás seguro de cancelar este préstamo? Esta acción no se puede deshacer.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Cancelar préstamo",
            style: "destructive",
            onPress: async () => {
              try {
                await baseCancelLoan(loanId);
                Alert.alert("Éxito", "Préstamo cancelado correctamente");
              } catch (err) {
                Alert.alert(
                  "Error",
                  err.message || "No se pudo cancelar el préstamo"
                );
              }
            },
          },
        ]
      );
    },
    [baseCancelLoan]
  );

  // ── Retorno ─────────────────────────────────────────────────────
  return {
    allLoans,
    filteredLoans,
    loading,
    filterStatus,
    setFilterStatus,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    filterUserId,
    setFilterUserId,
    stats,
    approveLoan,
    markDelivered,
    markReturned,
    cancelLoan,
    users: userMap,
  };
}
