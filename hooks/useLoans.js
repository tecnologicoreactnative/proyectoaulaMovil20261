import { useState, useCallback, useEffect } from "react";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { STATES, MAX_ACTIVE_LOANS, LOAN_DURATION_DAYS } from "../constants/loans";
import { db } from "../firebase";

export { STATES, MAX_ACTIVE_LOANS, LOAN_DURATION_DAYS };

export default function useLoans() {
  const [loading, setLoading] = useState(false);
  const [userLoans, setUserLoans] = useState([]);
  const [userLoansLoading, setUserLoansLoading] = useState(true);

  const requestLoan = useCallback(async (bookId, borrowerId) => {
    if (!bookId || !borrowerId) throw new Error("bookId and borrowerId required");
    setLoading(true);
    try {
      const bookRef = doc(db, "books", bookId);
      const loansCol = collection(db, "loans");
      const loanRef = doc(loansCol); // generate new doc ref

      await runTransaction(db, async (transaction) => {
        const bookSnap = await transaction.get(bookRef);
        if (!bookSnap.exists()) throw new Error("Libro no encontrado");
        const bookData = bookSnap.data();
        if (bookData.available === false) {
          throw new Error("Libro no disponible");
        }

        // Check active loan limit on user doc
        const userRef = doc(db, "users", borrowerId);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) throw new Error("Usuario no encontrado");
        const userData = userSnap.data();
        const activeLoansCount = userData.activeLoansCount || 0;
        if (activeLoansCount >= MAX_ACTIVE_LOANS) {
          throw new Error("Ya tenés 3 préstamos activos. Devolvé un libro antes de solicitar otro.");
        }

        // Mark book as not available (reserve for this request)
        transaction.update(bookRef, {
          available: false,
          updatedAt: serverTimestamp(),
        });

        // Increment active loan counter on user
        transaction.update(userRef, {
          activeLoansCount: activeLoansCount + 1,
        });

        // Create loan record with requested status
        transaction.set(loanRef, {
          bookId,
          borrowerId,
          status: STATES.REQUESTED,
          requestedAt: serverTimestamp(),
        });
      });

      return { success: true };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generic updater that enforces book availability on certain transitions
  const updateLoanStatus = useCallback(async (loanId, newStatus) => {
    if (!loanId || !newStatus) throw new Error("loanId and newStatus required");
    setLoading(true);
    try {
      const loanRef = doc(db, "loans", loanId);

      await runTransaction(db, async (transaction) => {
        // ── 1. ALL READS FIRST ──────────────────────────────────────
        const loanSnap = await transaction.get(loanRef);
        if (!loanSnap.exists()) throw new Error("Préstamo no encontrado");
        const loan = loanSnap.data();
        const current = loan.status;

        // Basic allowed transitions
        const allowed = {
          [STATES.REQUESTED]: [STATES.APPROVED],
          [STATES.APPROVED]: [STATES.DELIVERED, STATES.RETURNED],
          [STATES.DELIVERED]: [STATES.RETURNED],
          [STATES.RETURNED]: [],
        };

        if (!allowed[current] || !allowed[current].includes(newStatus)) {
          throw new Error(`Transición inválida: ${current} -> ${newStatus}`);
        }

        const bookRef = doc(db, "books", loan.bookId);
        const bookSnap = await transaction.get(bookRef);
        if (!bookSnap.exists()) throw new Error("Libro del préstamo no encontrado");

        // If returning: read borrower data BEFORE any write
        let borrowerSnap = null;
        if (newStatus === STATES.RETURNED) {
          const borrowerRef = doc(db, "users", loan.borrowerId);
          borrowerSnap = await transaction.get(borrowerRef);
        }

        // ── 2. ALL WRITES AFTER ─────────────────────────────────────

        // If moving to returned, mark book available
        if (newStatus === STATES.RETURNED) {
          transaction.update(bookRef, { available: true, updatedAt: serverTimestamp() });
        }

        // If moving to approved or delivered, ensure book is reserved/unavailable
        if (newStatus === STATES.APPROVED || newStatus === STATES.DELIVERED) {
          const bookData = bookSnap.data();
          if (bookData.available === true) {
            // book is somehow available; reserve it
            transaction.update(bookRef, { available: false, updatedAt: serverTimestamp() });
          }
        }

        // Update loan status and timestamps
        const updates = { status: newStatus };
        if (newStatus === STATES.APPROVED) updates.approvedAt = serverTimestamp();
        if (newStatus === STATES.DELIVERED) {
          const deliveredAtDate = new Date();
          updates.deliveredAt = serverTimestamp();
          updates.maxReturnDate = Timestamp.fromDate(
            new Date(deliveredAtDate.getTime() + 14 * 24 * 60 * 60 * 1000)
          );
        }
        if (newStatus === STATES.RETURNED) {
          const returnedAtDate = new Date();
          updates.returnedAt = serverTimestamp();

          // Decrement active loan counter (borrowerSnap ya se leyó arriba)
          const borrowerRef = doc(db, "users", loan.borrowerId);
          if (borrowerSnap && borrowerSnap.exists()) {
            const currentCount = borrowerSnap.data().activeLoansCount || 0;
            transaction.update(borrowerRef, {
              activeLoansCount: Math.max(0, currentCount - 1),
            });
          }

          // Check delay penalty
          const maxReturn = loan.maxReturnDate;
          if (maxReturn && borrowerSnap && borrowerSnap.exists()) {
            const maxReturnDate = maxReturn.toDate ? maxReturn.toDate() : new Date(maxReturn);
            if (returnedAtDate > maxReturnDate) {
              const borrowerData = borrowerSnap.data();
              const currentDelayCount = borrowerData.delayCount || 0;
              const newDelayCount = currentDelayCount + 1;
              const userUpdates = {
                delayCount: newDelayCount,
              };
              if (newDelayCount >= 3) {
                userUpdates.penaltyUntil = Timestamp.fromDate(
                  new Date(returnedAtDate.getTime() + 30 * 24 * 60 * 60 * 1000)
                );
              }
              transaction.update(borrowerRef, userUpdates);
            }
          }
        }

        transaction.update(loanRef, updates);
      });

      return { success: true };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveLoan = useCallback((loanId) => updateLoanStatus(loanId, STATES.APPROVED), [updateLoanStatus]);
  const markDelivered = useCallback((loanId) => updateLoanStatus(loanId, STATES.DELIVERED), [updateLoanStatus]);
  const markReturned = useCallback((loanId) => updateLoanStatus(loanId, STATES.RETURNED), [updateLoanStatus]);

  const checkUserPenalty = useCallback((user) => {
    if (!user || !user.penaltyUntil) return false;
    const penaltyDate = user.penaltyUntil?.toDate
      ? user.penaltyUntil.toDate()
      : new Date(user.penaltyUntil);
    return penaltyDate > new Date();
  }, []);

  // Cancel a loan request (only when REQUESTED or APPROVED)
  const cancelLoan = useCallback(async (loanId) => {
    if (!loanId) throw new Error("loanId required");
    setLoading(true);
    try {
      const loanRef = doc(db, "loans", loanId);

      await runTransaction(db, async (transaction) => {
        // ── 1. ALL READS FIRST ──────────────────────────────────────
        const loanSnap = await transaction.get(loanRef);
        if (!loanSnap.exists()) throw new Error("Préstamo no encontrado");
        const loan = loanSnap.data();
        const current = loan.status;

        // Validate: cannot cancel if already DELIVERED or RETURNED
        if (current === STATES.DELIVERED || current === STATES.RETURNED) {
          throw new Error("No se puede cancelar un préstamo que ya ha sido entregado");
        }

        // Validate: cannot cancel if already CANCELLED
        if (current === STATES.CANCELLED) {
          throw new Error("Esta solicitud ya ha sido cancelada");
        }

        // Only allow cancellation from REQUESTED or APPROVED states
        if (current !== STATES.REQUESTED && current !== STATES.APPROVED) {
          throw new Error(`No se puede cancelar un préstamo en estado: ${current}`);
        }

        const bookRef = doc(db, "books", loan.bookId);
        const bookSnap = await transaction.get(bookRef);
        if (!bookSnap.exists()) throw new Error("Libro del préstamo no encontrado");

        const borrowerRef = doc(db, "users", loan.borrowerId);
        const borrowerSnap = await transaction.get(borrowerRef);

        // ── 2. ALL WRITES AFTER ─────────────────────────────────────

        // Make book available again
        transaction.update(bookRef, {
          available: true,
          updatedAt: serverTimestamp(),
        });

        // Decrement active loan counter on user
        if (borrowerSnap.exists()) {
          const currentCount = borrowerSnap.data().activeLoansCount || 0;
          transaction.update(borrowerRef, {
            activeLoansCount: Math.max(0, currentCount - 1),
          });
        }

        // Update loan to cancelled status
        transaction.update(loanRef, {
          status: STATES.CANCELLED,
          cancelledAt: serverTimestamp(),
        });
      });

      return { success: true };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get loans for a specific user (real-time subscription)
  const subscribeToUserLoans = useCallback((userId) => {
    if (!userId) return () => {};
    
    setUserLoansLoading(true);
    const q = query(collection(db, "loans"), where("borrowerId", "==", userId));
    
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            bookId: data.bookId || null,
            borrowerId: data.borrowerId || null,
            status: data.status || "solicitado",
            requestedAt: data.requestedAt?.toDate ? data.requestedAt.toDate() : null,
            approvedAt: data.approvedAt?.toDate ? data.approvedAt.toDate() : null,
            deliveredAt: data.deliveredAt?.toDate ? data.deliveredAt.toDate() : null,
            maxReturnDate: data.maxReturnDate?.toDate ? data.maxReturnDate.toDate() : null,
            returnedAt: data.returnedAt?.toDate ? data.returnedAt.toDate() : null,
            cancelledAt: data.cancelledAt?.toDate ? data.cancelledAt.toDate() : null,
          };
        });
        setUserLoans(items);
        setUserLoansLoading(false);
      },
      (err) => {
        console.error("subscribeToUserLoans error:", err);
        setUserLoans([]);
        setUserLoansLoading(false);
      }
    );
    
    return unsub;
  }, []);

  return { 
    requestLoan, 
    updateLoanStatus, 
    approveLoan, 
    markDelivered, 
    markReturned, 
    cancelLoan,
    loading, 
    STATES,
    userLoans,
    userLoansLoading,
    subscribeToUserLoans,
    checkUserPenalty,
  };
}
