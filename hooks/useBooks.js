import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import * as FileSystem from "expo-file-system/legacy";
import uploadToCloudinary from "./useCloudinary";
import { db, storage } from "../firebase";

export default function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const q = collection(db, "books");
      const snap = await getDocs(q);
      console.log("useBooks: loaded docs count", snap.size);
      const items = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          let image = data.image || null;
          if (!image && data.imagePath) {
            try {
              image = await getDownloadURL(storageRef(storage, data.imagePath));
            } catch (e) {
              console.warn("useBooks: failed to get image url for", d.id, e);
              image = null;
            }
          }
          return {
            id: d.id,
            title: data.title || "Untitled",
            author: data.author || "",
            image,
            description: data.description || "",
            available: data.available ?? true,
          };
        }),
      );

      setBooks(items);
    } catch (err) {
      console.error("useBooks: error loading books", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  async function uploadImageForBook(bookId, base64OrUri) {
    if (!base64OrUri) return null;
    try {
      let blob;
      const path = `books/${bookId}/cover.jpg`;
      const ref = storageRef(storage, path);

      // If we received raw base64 (without data: prefix), use uploadString
      const cleaned = base64OrUri.replace(/\s+/g, "");
      if (/^[A-Za-z0-9+/]+=*$/.test(cleaned.slice(0, 40))) {
        await uploadString(ref, cleaned, "base64");
      } else if (base64OrUri.startsWith("data:")) {
        // data URI -> extract base64 and upload
        const parts = base64OrUri.split(",");
        const b64 = parts[1] || "";
        await uploadString(ref, b64, "base64");
      } else if (
        base64OrUri.startsWith("file:") ||
        base64OrUri.startsWith("content:")
      ) {
        // local file uri (expo) -> read as base64 and upload
        try {
          const b64 = await FileSystem.readAsStringAsync(base64OrUri, {
            encoding: "base64",
          });
          await uploadString(ref, b64, "base64");
        } catch (e) {
          console.error("uploadImageForBook: read file failed", e);
          throw e;
        }
      } else {
        // fallback for http(s): try fetch and upload as blob (may fail on some RN setups)
        try {
          const res = await fetch(base64OrUri);
          const blobData = await res.blob();
          await uploadBytes(ref, blobData);
        } catch (e) {
          console.error("uploadImageForBook: http upload failed", e);
          throw e;
        }
      }
      const url = await getDownloadURL(ref);
      return { path, url };
    } catch (err) {
      console.error("uploadImageForBook", err);
      return null;
    }
  }

  async function addBook(data, imageUri) {
    try {
      // create doc to obtain id
      const col = collection(db, "books");
      const docRef = await addDoc(col, {
        title: data.title || "Untitled",
        author: data.author || "",
        description: data.description || "",
        category: data.category || "",
        tags: data.tags || [],
        available: data.available ?? true,
        ownerId: data.ownerId || null,
        rating: data.rating ?? 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const bookId = docRef.id;

      // upload image if provided
      if (imageUri) {
        try {
          // If imageUri is base64 string, use Cloudinary (no server needed)
          const cleaned = (imageUri || "").replace(/\s+/g, "");
          if (/^[A-Za-z0-9+/]+=*$/.test(cleaned.slice(0, 40))) {
            // configure with your cloud name and preset or read from env/config
            const cloudName = "ddfhhuztk";
            const uploadPreset = "biblioteca-tdea";
            const cloudResp = await uploadToCloudinary(cleaned, {
              cloudName,
              uploadPreset,
            });
            if (cloudResp && cloudResp.secure_url) {
              await setDoc(
                doc(db, "books", bookId),
                {
                  imagePath: null,
                  image: cloudResp.secure_url,
                  cloudinaryId: cloudResp.public_id,
                  updatedAt: serverTimestamp(),
                },
                { merge: true },
              );
            }
          } else {
            const uploaded = await uploadImageForBook(bookId, imageUri);
            if (uploaded) {
              await setDoc(
                doc(db, "books", bookId),
                {
                  imagePath: uploaded.path,
                  image: uploaded.url,
                  updatedAt: serverTimestamp(),
                },
                { merge: true },
              );
            }
          }
        } catch (e) {
          console.error("addBook: image upload failed", e);
        }
      }

      // refresh local list
      await loadBooks();
      return { id: bookId };
    } catch (err) {
      console.error("addBook error", err);
      throw err;
    }
  }

  useEffect(() => {
    // prefer realtime listener so UI updates automatically when DB changes
    setLoading(true);
    const q = collection(db, "books");
    const unsub = onSnapshot(
      q,
      async (snap) => {
        try {
          const items = await Promise.all(
            snap.docs.map(async (d) => {
              const data = d.data();
              let image = data.image || null;
              if (!image && data.imagePath) {
                try {
                  image = await getDownloadURL(
                    storageRef(storage, data.imagePath),
                  );
                } catch (e) {
                  image = null;
                }
              }
              return {
                id: d.id,
                title: data.title || "Untitled",
                author: data.author || "",
                image,
                description: data.description || "",
                available: data.available ?? true,
              };
            }),
          );
          console.log("useBooks:onSnapshot docs", snap.size);
          setBooks(items);
        } catch (e) {
          console.error("useBooks:onSnapshot processing error", e);
          setBooks([]);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("useBooks:onSnapshot error", err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [loadBooks]);

  return { books, loading, refresh: loadBooks, addBook };
}
