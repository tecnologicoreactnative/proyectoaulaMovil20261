import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../colors";

export function BookSkeleton({ size }) {
  return (
    <View style={{ width: size, marginBottom: 12 }}>
      <View
        style={[
          styles.imagePlaceholder,
          { width: size, height: size * 1.4, borderRadius: 12 },
        ]}
      />
      <View style={{ padding: 8 }}>
        <View style={[styles.titlePlaceholder, { width: "85%" }]} />
        <View style={[styles.authorPlaceholder, { width: "60%" }]} />
      </View>
    </View>
  );
}

export default BookSkeleton;

const styles = StyleSheet.create({
  imagePlaceholder: {
    backgroundColor: colors.surfaceAlt,
    marginBottom: 8,
  },
  titlePlaceholder: {
    height: 14,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    marginBottom: 6,
  },
  authorPlaceholder: {
    height: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
  },
});
