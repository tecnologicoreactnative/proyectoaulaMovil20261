import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Heading from "./Heading";
import Body from "./Body";
import { colors } from "./colors";

export function EmptyState({ icon, title, description, action }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon || (
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>📚</Text>
          </View>
        )}
      </View>
      <Heading style={styles.title}>{title}</Heading>
      <Body style={styles.description}>{description}</Body>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    opacity: 0.8,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  iconPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
});
