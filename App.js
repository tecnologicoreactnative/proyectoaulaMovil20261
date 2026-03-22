import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import Details from "./screens/Details";
import AddBook from "./screens/AddBook";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen
        name="AddBook"
        component={AddBook}
        options={{
          headerShown: true,
          title: "Agregar libro",
          headerBackTitle: "Volver",
        }}
      />
      <MainStack.Screen
        name="Details"
        component={Details}
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.book?.title ?? "Detalles",
          headerBackTitle: "Volver",
        })}
      />
    </MainStack.Navigator>
  );
}

function RootRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <MainStackScreen /> : <AuthStackScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootRoutes />
      </NavigationContainer>
    </AuthProvider>
  );
}
