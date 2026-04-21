import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./contexts/AuthContext";
import { RootNavigator } from "./stacks/";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
