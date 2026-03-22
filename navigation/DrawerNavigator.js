import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import AddBook from "../screens/AddBook";
import Details from "../screens/Details";
import { useAuth } from "../contexts/AuthContext";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="AddBook"
        component={AddBook}
        options={{ headerShown: true, title: "Agregar libro", headerBackTitle: "Volver" }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={({ route }) => ({ headerShown: true, title: route.params?.book?.title ?? "Detalles", headerBackTitle: "Volver" })}
      />
    </Stack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { signOut, user } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={user?.email ?? "Usuario"}
        onPress={() => {}}
        inactiveTintColor="#666"
      />
      <DrawerItem
        label="Cerrar sesión"
        onPress={() => {
          signOut();
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Inicio" component={MainStackNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}
