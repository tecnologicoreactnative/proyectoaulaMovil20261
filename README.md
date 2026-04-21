# Proyecto: App de Biblioteca (Proyecto de Desarrollo Móvil)

## Resumen del proyecto

Esta aplicación móvil permite a los usuarios gestionar una biblioteca digital: pueden registrarse, iniciar sesión, agregar libros (incluyendo subir una imagen de portada obligatoria), ver detalles de cada libro, filtrar por categorías, y gestionar préstamos (solicitar, aprobar, entregar, devolver y cancelar).

El objetivo es que los estudiantes comprendan cómo se estructura una app real usando React Native y Expo, integrando servicios externos como Firebase (para autenticación y base de datos) y Cloudinary (para almacenar imágenes en la nube).

El código está organizado para que sea fácil de entender, modificar y presentar en una sustentación grupal.

## Nuevas funcionalidades

- **Filtrado por categorías**: Los libros pueden filtrarse por categoría desde la pantalla principal. Las categorías se muestran como chips horizontales.
- **Categorías predefinidas**: 15 categorías preset (Romance, Adolescente, Terror, Thriller, Ciencia, Ficción, Fantasia, Histórica, Aventura, Misterio, Biografía, Psicología, Drama, Novela, Fantasía Oscura) con colores asociados.
- **Categorías múltiples**: Un libro puede tener varias categorías, seleccionadas mediante un modal multi-select.
- **Cancelación de préstamos**: Los usuarios pueden cancelar sus solicitudes de préstamo cuando están en estado "solicitado" o "aprobado".
- **Badge de estado en detalles**: La vista de detalles del libro muestra el estado del préstamo en tiempo real.
- **Imagen obligatoria**: Al agregar un libro, la imagen de portada es obligatoria.

## Características del rediseño premium

La aplicación fue rediseñada con una UI moderna y premium:

- **Iconos Ionicons**: Uso consistente de `@expo/vector-icons` en todas las pantallas
- **Diseño compacto y refinado**: Tarjetas horizontales para libros, hero sections, FABs
- **Experiencia de usuario mejorada**: Skeletons de carga, estados vacíos, badges flotantes
- **Arquitectura de componentes**: Separación clara entre UI (components), lógica (hooks) y pantallas (screens)

---

## Cómo usar (rápido)

1. Clonar el repositorio.
2. Instalar dependencias: `npm install` o `yarn install`.
3. Configurar credenciales de Firebase en `firebase.js` (API keys, authDomain, etc.).
4. Ejecutar la app: `npx expo start` (o `expo start`) y usar Expo Go o un emulador.

---

## Qué presentar en la sustentación (puntos clave)

- Explicar la arquitectura general: componentes, contextos, hooks y pantallas.
- Mostrar flujo de autenticación: registro, login y persistencia de usuario.
- Demostrar agregar un libro con imagen (subida a Cloudinary) y cómo se muestra en la lista.
- Mostrar detalles de libro y flujo de préstamo (prestar / devolver).
- Comentar decisiones técnicas: por qué usar hooks personalizados, contexto para auth, y separación de componentes.
- Resaltar el rediseño premium: uso de Ionicons, tarjetas compactas, hero sections.

---

## Descripción de archivos y carpetas

### Archivos raíz

| Archivo | Descripción |
|---------|-------------|
| `App.js` | Archivo principal donde inicia la app. Configura la navegación global y los providers de contexto. |
| `app.json` | Configuración de Expo (nombre, icono, orientación, permisos). |
| `babel.config.js` | Configuración de Babel para compatibilidad con JavaScript moderno. |
| `env.d.ts` | Definiciones de tipos para variables de entorno (TypeScript). |
| `firebase.js` | Inicialización de Firebase con credenciales. Exporta `auth`, `db` y `storage`. |
| `index.js` | Punto de entrada que registra la app con React Native/Expo. |
| `package.json` | Dependencias, scripts y metadatos del proyecto. |

---

### Carpeta `assets/`

Recursos estáticos: imágenes, iconos, logos y archivos que no cambian durante la ejecución.

---

### Carpeta `components/` (UI reutilizable)

Organizada en subcarpetas temáticas para mejor mantenibilidad:

| Componente | Descripción |
|------------|-------------|
| **Auth** | |
| `LoginForm.js` | Formulario de inicio de sesión con UI premium, toggle de password, Ionicons |
| `RegisterForm.js` | Formulario de registro con DateTimePicker para fecha de nacimiento |
| **Book** | |
| `BookDetails.js` | Vista de detalles con hero image y badge de estado de préstamo en tiempo real |
| `BookForm.js` | Formulario para agregar libros con modal multi-select de categorías, imagen obligatoria |
| `BookItem.js` | Tarjeta horizontal compacta con preview de descripción |
| `BookSkeleton.js` | Animación de carga esqueleto |
| **Home** | |
| `HomeContent.js` | Contenido principal con lista de libros, filtro por categorías, búsqueda, hero section, FAB |
| `HomeFilters.js` | Barra de búsqueda y filtros de categorías |
| **Common** | |
| `CategoryFilter.js` | Componente de chips horizontales para filtrar por categorías |
| **Loans** | |
| `ActiveLoansList.js` | Lista de préstamos activos con botón para cancelar (en solicitado/aprobado) |
| `LoanHistoryList.js` | Historial de préstamos devueltos y cancelados |
| **UI Base** | |
| `AppText.js` | Componente Text personalizado con tipografía consistente |
| `Body.js` | Contenedor con márgenes y paddings estándar |
| `Card.js` | Tarjeta visual con bordes redondeados y sombra |
| `colors.js` | Esquema de colores centralizado |
| `EmptyState.js` | Mensaje cuando no hay datos |
| `GradientButton.js` | Botón con gradiente para acciones importantes |
| `Heading.js` | Encabezados de sección |
| `HeaderBar.js` | Header personalizado con prop `showBackButton` y menú con Ionicons |
| `LoanButton.js` | Botón para solicitar/cancelar préstamo según estado |
| `MenuModal.js` | Menú lateral personalizado |
| `PrimaryButton.js` | Botón principal con variantes (primary/secondary/danger) |

---

### Carpeta `contexts/`

| Contexto | Descripción |
|----------|-------------|
| `AuthContext.js` | Estado global de autenticación. Provee `user`, `loading`, `login`, `logout`, `register`. Mantiene sesión activa con persistencia. |

---

### Carpeta `hooks/` (lógica reutilizable)

| Hook | Descripción |
|------|-------------|
| `useAuthActions.js` | Funciones para registro, login, logout y recuperación de usuario actual. Usa Firebase Auth. |
| `useBooks.js` | CRUD de libros: obtener lista, agregar, editar, eliminar. Sincronización con Firestore. Soporta categorías múltiples. Exporta `PRESET_CATEGORIES`. |
| `useCloudinary.js` | Subida de imágenes a Cloudinary, devuelve URL pública. |
| `useLoans.js` | Gestión de préstamos: crear, aprobar, entregar, devolver, cancelar. Historial y préstamos activos. Estados: solicitado, aprobado, entregado, devuelto, cancelado. |

### Carpeta `constants/` (constantes globales)

| Archivo | Descripción |
|---------|-------------|
| `categoryColors.js` | Mapeo de colores para cada categoría preset |
| `presetCategories.js` | 15 categorías predefinidas para libros |

---

### Carpeta `navigation/`

| Archivo | Descripción |
|---------|-------------|
| `DrawerNavigator.js` | Menú lateral con rutas principales protegidas. |

### Carpeta `__tests__/` (tests unitarios)

| Archivo | Descripción |
|---------|-------------|
| `deriveCategoriesFromBooks.test.js` | Tests para la función de derivación de categorías desde libros |

---

### Carpeta `screens/` (pantallas principales)

| Pantalla | Descripción |
|---------|-------------|
| `AddBook.js` | Agregar nuevo libro con formulario, selector de imagen, subida a Cloudinary |
| `Details.js` | Información completa de un libro: portada, título, autor, estado, acciones |
| `Home.js` | Pantalla principal con lista de libros, búsqueda, filtros |
| `Login.js` | Ingreso con email y contraseña |
| `Register.js` | Creación de nueva cuenta |
| `MisPrestamos.js` | Vista de préstamos activos e historial |

---

## Notas técnicas para la presentación

### Autenticación
- Login, registro y persistencia de sesión centralizados en `AuthContext`
- Cualquier pantalla puede saber si el usuario está autenticado
- Redirección automática a Login si no hay sesión activa

### Subida de imágenes
- `useCloudinary` toma la imagen → la sube → devuelve URL pública
- Las credenciales deben estar en variables de entorno en producción
- Imagen de portada es **obligatoria** al agregar un libro

### Estado y sincronización
- `useBooks` y `useLoans` manejan datos en tiempo real desde Firebase
- Cambios se reflejan automáticamente en todas las pantallas
- `BookDetails` muestra el estado del préstamo en tiempo real

### Categorías
- 15 categorías preset definidas en `constants/presetCategories.js`
- Cada categoría tiene un color asociado en `constants/categoryColors.js`
- Los libros pueden tener múltiples categorías (array)
- Filtrado desde Home con chips horizontales

### Préstamos y cancelaciones
- Estados: solicitado → aprobado → entreguedo → devuelto
- Estados especiales: cancelado (para solicitudes canceladas)
- Los usuarios pueden cancelar en estados "solicitado" o "aprobado"
- El libro vuelve a estar disponible al cancelar

### Diseño premium
- Uso consistente de `@expo/vector-icons/Ionicons` en TODOS los iconos
- Tarjetas horizontales compactas para libros
- Hero sections en Home y Details
- FAB (Floating Action Button) para agregar libros
- Badges flotantes de estado (disponible, solicitado, aprobado, entregado, cancelado)

---

## Cómo repartirse la presentación (3 personas)

### Persona 1 — Arquitectura y navegación
- Estructura de carpetas: components/, hooks/, contexts/, screens/
- Flujo de navegación: Login → Home → Drawer → otras pantallas
- Protección de rutas para usuarios no autenticados

### Persona 2 — Autenticación y datos
- Firebase Auth: login, registro, sesión persistente
- hooks: `useBooks`, `useCloudinary`, `useLoans`
- Sincronización en tiempo real con Firestore

### Persona 3 — UI y demo
- Mostrar Login/Register con diseño premium
- Demo: agregar libro con imagen, ver detalles, prestar/devolver
- Resaltar el uso de Ionicons y el diseño compacto

---

## Checklist antes de la presentación

- [ ] Verificar credenciales de Firebase en `firebase.js`
- [ ] Tener imágenes de prueba en `assets/` o usar cámara desde Expo Go
- [ ] Probar que la app corre con `npx expo start`
- [ ] Cada integrante sabe qué mostrar y en qué orden
- [ ] Todos los hooks y contextos funcionan correctamente
- [ ] Verificar que los datos se actualizan en tiempo real

---

## Stack tecnológico

- **Framework**: React Native + Expo
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Almacenamiento de imágenes**: Cloudinary
- **Navegación**: React Navigation (Drawer + Stack)
- **Iconos**: @expo/vector-icons (Ionicons)
- **Estado global**: React Context API
- **UI**: Componentes personalizados + StyleSheet
- **Testing**: Jest (unit tests)

---

## Cómo ejecutar tests

```bash
npm test
```

Los tests actuales verifican la derivación de categorías desde libros en `useBooks.js`.

