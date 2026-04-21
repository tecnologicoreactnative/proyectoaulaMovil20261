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
- `hooks/`: Custom logic (useAuth, useBooks, useCloudinary, useLoans)
- `contexts/`: React context providers (AuthContext)
- `navigation/`: Screen routing (DrawerNavigator)
- `screens/`: Main app screens (Home, Login, Register, AddBook, Details)
- `assets/`: Static images, icons (access with `require('../assets/name.png')`)

## Important Conventions
- **Imports**: 1) React, 2) External deps, 3) Internal files
- **Naming**: 
  - Components: PascalCase (HomeScreen)
  - Hooks: camelCase with `use` prefix (useAuth)
  - Variables: camelCase (handleSubmit)
  - Constants: UPPER_SNAKE_CASE (API_URL) or camelCase
- **Colors**: Defined in `components/colors.js` - use semantic names
- **Images**: Static in `assets/` accessed via `require()`
- **State**: 
  - Local: useState
  - Shared: Context API (AuthContext)
  - Avoid derived state in state - compute in render
- **Firebase**: Already configured in `firebase.js` - exports auth, db, storage

## Gotchas
- Firebase credentials hardcoded in `firebase.js` - should use env vars in prod
- Image uploads use Cloudinary via `useCloudinary.js` hook
- No linting/testing configured yet (recommended: ESLint, Prettier, Jest)
- AsyncStorage used for persistence (`@react-native-async-storage/async-storage`)
- Navigation protected via DrawerNavigator - unauthenticated users redirected to Login

## Development Notes
- Prefer functional components with hooks
- Extract complex logic to custom hooks in `hooks/`
- Avoid console.log in committed code - use console.warn/error only for dev debugging
- Follow existing file patterns - don't invent new structures