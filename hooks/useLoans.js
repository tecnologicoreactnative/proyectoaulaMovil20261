import { useState, useCallback } from "react";
import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const STATES = {
  REQUESTED: "solicitado",
  APPROVED: "aprobado",
  DELIVERED: "entregado",
  RETURNED: "devuelto",
};

export default function useLoans() {
  const [loading, setLoading] = useState(false);

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

        // Mark book as not available (reserve for this request)
        transaction.update(bookRef, {
          available: false,
          updatedAt: serverTimestamp(),
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
        if (newStatus === STATES.DELIVERED) updates.deliveredAt = serverTimestamp();
        if (newStatus === STATES.RETURNED) updates.returnedAt = serverTimestamp();

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

  return { requestLoan, updateLoanStatus, approveLoan, markDelivered, markReturned, loading, STATES };
}
