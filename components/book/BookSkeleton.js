import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../colors";

export function BookSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.coverPlaceholder} />
      <View style={styles.content}>
        <View style={styles.titleLine} />
        <View style={styles.authorLine} />
        <View style={styles.bottomRow}>
          <View style={styles.categoryLine} />
          <View style={styles.badgeLine} />
        </View>
      </View>
    </View>
  );
}

export default BookSkeleton;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    overflow: "hidden",
  },
  coverPlaceholder: {
    width: 72,
    height: 100,
    backgroundColor: colors.surfaceAlt,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 8,
  },
  titleLine: {
    height: 14,
    width: "75%",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
  },
  authorLine: {
    height: 12,
    width: "50%",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  categoryLine: {
    height: 22,
    width: 70,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
  },
  badgeLine: {
    height: 22,
    width: 60,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
  },
});
