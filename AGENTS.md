# AGENTS.md - Essential Guidelines for Expo/React Native Library App

## Key Commands
- `npm start` or `expo start`: Start development server
- `npm run android`: Run on Android emulator/device  
- `npm run ios`: Run on iOS simulator/device
- `npm run web`: Run in web browser
- Environment variables: Configure via `.env` file (uses react-native-dotenv)
- Firebase config: Update credentials in `firebase.js` if needed

## Project Structure (Non-obvious)
- `components/`: Reusable UI components (buttons, cards, etc.)
- `components/admin/`: Componentes específicos de admin
- `hooks/`: Custom logic (useAuth, useBooks, useCloudinary, useLoans)
- `hooks/useAdminBooks.js`: Hook de admin para libros (CRUD + validaciones)
- `contexts/`: React context providers (AuthContext)
- `screens/`: Main app screens (Home, Login, Register, AddBook, Details)
- `screens/Admin/`: Pantallas de administración
- `stacks/`: Navigation stacks (index.js)
- `assets/`: Static images, icons (access with `require('../assets/name.png')`)

## Clean Architecture Pattern (OBLIGATORIO)

### 3 Capas:
1. **Hooks** (`hooks/`)
   - Llamadas a Firebase/API
   - Validaciones de negocio
   - Feedback al usuario (Alert)
   - Estado y lógica de datos

2. **Componentes** (`components/`)
   - Lógica de renderizado UI
   - Estados visuales (loading, empty)
   - Interacciones de UI sin lógica de negocio
   - Reutilizables en toda la app

3. **Screens** (`screens/`)
   - Solo composición de componentes y hooks
   - NO contienen lógica de negocio
   - Manejan navegación y parámetros de ruta

### Ejemplo de flujo correcto:
```
Screen → Hook (lógica) → Componente (render)
```

### ERRORES COMUNES A EVITAR:
- ❌ Screen con llamada directa a Firebase
- ❌ Componente con validaciones de negocio
- ❌ Hook con lógica de renderizado

## Important Conventions
- **Imports orden**: 1) React, 2) External deps, 3) Internal files
- **Naming**: 
  - Componentes: PascalCase (HomeScreen, BookListItem)
  - Hooks: camelCase con prefijo `use` (useAuth, useAdminBooks)
  - Variables: camelCase (handleSubmit)
  - Constantes: UPPER_SNAKE_CASE (API_URL) o camelCase
- **Colors**: Usar `colors` de `components/colors.js` - nombres semánticos
- **Iconos**: Ionicons de expo (@expo/vector-icons)
- **Imágenes**: Static en `assets/` o URL remota (Cloudinary)
- **State**: 
  - Local: useState
  - Compartido: Context API (AuthContext)
  - Evitar estado derivado - calcular en render
- **Firebase**: Ya configurado en `firebase.js` - exporta auth, db, storage

## Gotchas
- Credenciales Firebase hardcodeadas en `firebase.js` - usar env vars en prod
- Subida de imágenes via Cloudinary usando `useCloudinary.js`
- No linting/testing configurado (recomendado: ESLint, Prettier, Jest)
- AsyncStorage usado para persistencia (`@react-native-async-storage/async-storage`)
- Navegación protegida - usuarios no autenticados redirigidos a Login
- **Menú**: MenuModal.js (no DrawerNavigator) - contiene opciones de admin condicionadas por `user?.role === "admin"`

## Development Notes
- Preferir componentes funcionales con hooks
- Extraer lógica compleja a custom hooks en `hooks/`
- Avoid console.log en código comprometido - usar console.warn/error solo para debugging
- Follow existing file patterns - no inventar nuevas estructuras
- **Siempre** seguir el patrón de arquitectura limpia de 3 capas