# Skill Registry - proyecto_desarrollo_movil

> Generated: 2026-05-09

## Project Skills (.agents/skills/)

### 1. frontend-design

- **Path**: `.agents/skills/frontend-design/SKILL.md`
- **Trigger**: Production-grade frontend interfaces, web components, pages, styling/beautifying UI
- **Key Rules**:
  - Override default LLM biases for design
  - Strict component architecture
  - CSS hardware acceleration
  - Metric-based design rules

### 2. building-native-ui

- **Path**: `.agents/skills/building-native-ui/SKILL.md`
- **Trigger**: Building beautiful apps with Expo Router
- **Key Rules**:
  - Fundamentals, styling, components, navigation
  - Animations and native patterns
  - Visual effects, controls, icons

## Conventions (AGENTS.md)

- 3-layer Clean Architecture: Hooks → Components → Screens
- PascalCase components, camelCase hooks (prefix "use")
- UPPER_SNAKE_CASE constants, semantic colors from components/colors.js
- Ionicons from @expo/vector-icons
- Navigation: HeaderBar + native-stack, MenuModal (not DrawerNavigator)
- Admin menu conditional on `user?.role === "admin"`

## Stack

- Expo 55 + React Native 0.83
- Firebase (Auth, Firestore, Storage)
- Cloudinary (useCloudinary hook)
- React Navigation (native-stack + drawer)