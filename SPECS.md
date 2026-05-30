# SPECS.md - Guía de Desarrollo

Este documento establece las reglas, patrones y restricciones para desarrollar en este proyecto.

---

## 1. Arquitectura Limpia (OBLIGATORIO)

El proyecto sigue una arquitectura de 3 capas. **Siempre** respetar el flujo:

```
Screen → Hook (lógica) → Componente (render)
```

### 1.1 Hooks (`hooks/`)

**Qué hacer:**
- Llamadas a Firebase/Firestore
- Validaciones de negocio
- Feedback al usuario (Alert)
- Estado y lógica de datos
- Retornar funciones utilitarias

**Qué NO hacer:**
- Lógica de renderizado UI
- No retornar JSX

```javascript
// ✅ Correcto
export default function useAdminBooks() {
  const { books, deleteBook } = useBooks();
  
  const confirmAndDelete = useCallback((book) => {
    Alert.alert("Eliminar", "...", [...]);
    // lógica de validación y llamada a Firebase
  }, [deleteBook]);

  return { books, confirmAndDelete };
}

// ❌ Incorrecto - esto va en componente
function useAdminBooks() {
  return <View>...</View>; // NO!
}
```

### 1.2 Componentes (`components/`)

**Qué hacer:**
- Renderizado UI (Views, Text, TouchableOpacity, etc.)
- Estados visuales (loading, empty, error)
- Interacciones de UI (onPress, onChangeText)
- Recibir datos y callbacks como props

**Qué NO hacer:**
- Validaciones de negocio
- Llamadas directas a Firebase
- Lógica compleja de datos

```javascript
// ✅ Correcto - solo renderizado
export default function BookListItem({ book, onEdit, onDelete }) {
  return (
    <View>
      <Text>{book.title}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Text>Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ❌ Incorrecto - esto va en hook
export default function BookListItem({ book }) {
  const { deleteBook } = useBooks(); // NO! Lógica de negocio
  // ...
}
```

### 1.3 Screens (`screens/`)

**Qué hacer:**
- Componer componentes
- Usar hooks para lógica
- Manejar navegación
- Pasar callbacks a componentes

**Qué NO hacer:**
- Lógica de negocio
- Validaciones
- Firebase calls directas

```javascript
// ✅ Correcto - solo composición
export default function AdminBooksScreen() {
  const navigation = useNavigation();
  const { books, confirmAndDelete } = useAdminBooks();

  const handleEdit = (book) => navigation.navigate("BookEdit", {...});
  const handleDelete = (book) => confirmAndDelete(book);

  return (
    <View>
      <HeaderBar title="Gestión de Libros" />
      <AdminBooksList books={books} onEdit={handleEdit} onDelete={handleDelete} />
    </View>
  );
}

// ❌ Incorrecto - lógica en pantalla
export default function AdminBooksScreen() {
  const { deleteBook } = useBooks(); // NO! Llamada directa
  const handleDelete = async (id) => {
    await deleteBook(id); // NO! Lógica de negocio
  };
}
```

---

## 2. Nomenclatura

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Componentes | PascalCase | `HomeScreen`, `BookListItem` |
| Hooks | camelCase + `use` | `useAuth`, `useAdminBooks` |
| Variables | camelCase | `handleSubmit`, `booksList` |
| Constantes | UPPER_SNAKE o camelCase | `API_URL`, `maxLength` |
| Archivos | igual que contenido | `useAuth.js`, `BookListItem.js` |

---

## 3. Imports

**Orden obligatorio:**
1. React (si es necesario)
2. Dependencias externas (`@react-navigation/`, `expo-`, `firebase/`)
3. Archivos internos (`../components/`, `./hooks/`)

```javascript
import React from "react";                          // 1. React
import { View, Text } from "react-native";          // 2. External
import { useNavigation } from "@react-navigation/native";
import HeaderBar from "../components/HeaderBar";     // 3. Internal
import useAdminBooks from "../hooks/useAdminBooks";
import { colors } from "../components/colors";
```

---

## 4. Colores

**Siempre** usar `colors` de `components/colors.js`:

```javascript
import { colors } from "../components/colors";

// ✅ Correcto - nombres semánticos
<View style={{ backgroundColor: colors.surface }}>
<Text style={{ color: colors.primary }}>

// ❌ Incorrecto - colores hardcodeados
<View style={{ backgroundColor: "#FFFFFF" }}>
```

**Paleta disponible:**
```javascript
colors.primary      // #4F46E5 - principal
colors.primaryDark // #4338CA
colors.primaryLight// #818CF8
colors.accent      // #EC4899 - secundario
colors.text        // #111827
colors.textLight   // #4B5563
colors.textMuted   // #9CA3AF
colors.success     // #10B981 - verde
colors.warning     // #F59E0B - amarillo
colors.error       // #EF4444 - rojo
colors.info        // #3B82F6 - azul
colors.background  // #F9FAFB
colors.surface     // #FFFFFF
colors.surfaceAlt  // #F3F4F6
colors.border      // #E5E7EB
```

---

## 5. Iconos

Usar **Ionicons** de expo (`@expo/vector-icons`):

```javascript
import { Ionicons } from "@expo/vector-icons";

// ✅ Correcto
<Ionicons name="add" size={24} color={colors.primary} />
<Ionicons name="book" size={20} color={colors.textMuted} />

// ❌ Incorrecto - otros icon sets
import { MaterialIcons } from "@expo/vector-icons"; // Evitar si no es necesario
```

---

## 6. Imágenes

- **Static**: en `assets/` → usar `require()`
- **Remotas**: URL de Cloudinary

```javascript
// Static
<Image source={require('../../assets/book-cover.png')} />

// Remota
<Image source={{ uri: book.image }} />
```

---

## 7. Navegación

El proyecto usa **Stack Navigator** (`stacks/index.js`), NO Drawer.

```javascript
// Rutas disponibles en stacks/index.js
- Home
- AddBook
- Details
- MisPrestamos
- AdminBooks
- BookEdit
- AdminLoans
```

**Menú**: `components/MenuModal.js` (modal slide desde arriba)

```javascript
// Navegar
navigation.navigate("AdminBooks");

// Volver
navigation.goBack();
```

---

## 8. Firebase

Ya configurado en `firebase.js`:

```javascript
import { auth, db, storage } from "../firebase";

// Firestore
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

// Auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
```

---

## 9. Hooks Existentes

| Hook | Función |
|------|---------|
| `useAuth` | Auth actual (user, loading, login, register, signOut) |
| `useBooks` | Lista libros (books, loading, addBook) |
| `useAdminBooks` | Admin libros (confirmAndDelete, createBook, editBook) |
| `useLoans` | Préstamos usuario |
| `useCloudinary` | Subida de imágenes |

---

## 10. Testing y Debug

- **Console**: evitar `console.log` en código producido
- **Debug**: usar `console.warn()` o `console.error()`
- **No testing configurado** (recomendado: agregar Jest + Testing Library)

---

## 11.	Errores Comunes a Evitar

| Error | Solución |
|-------|----------|
| Screen con Firebase directo | Mover a hook |
| Componente con validaciones | Mover a hook |
| Hook con JSX | Mover a componente |
| Colores hardcodeados | Usar `colors` |
| Imports desordenados | Seguir orden de imports |
| Nombres inconsistentes | Usar tabla de nomenclatura |

---

## 12.	Ejemplo Completo

**Flujo para agregar edición de libro:**

1. **Hook** (`hooks/useAdminBooks.js`):
   - validar datos
   - llamar Firebase (updateBook)
   - mostrar Alert de éxito/error
   - retornar `{ editBook }`

2. **Componente** (`components/admin/BookListItem.js`):
   - recibir `book`, `onEdit`, `onDelete` como props
   - renderizar info del libro
   - renderizar botones editar/eliminar

3. **Screen** (`screens/Admin/AdminBooksScreen.js`):
   - usar hook `useAdminBooks`
   - pasar callbacks a componente
   - renderizar HeaderBar + AdminBooksList

---

**Esta guía es obligatoria para todo el código nuevo.**