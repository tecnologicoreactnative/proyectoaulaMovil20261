import React from "react";
import { View, StyleSheet } from "react-native";
import HeaderBar from "../components/HeaderBar";
import HomeContent from "../components/home/HomeContent";
import { colors } from "../components/colors";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <HeaderBar title="Biblioteca" navigation={navigation} showBackButton={false} />
      <HomeContent navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
