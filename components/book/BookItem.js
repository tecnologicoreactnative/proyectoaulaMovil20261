import React, { useState } from "react";
import { Animated, TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";

export function BookItem({ item, itemSize, navigation }) {
  const [animatedValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // Calculate sizes for compact card
  const cardHeight = 120;
  const coverWidth = 70;
  const coverHeight = cardHeight - 16;

  return (
    <Animated.View
      style={{
        width: itemSize,
        marginBottom: 10,
        alignSelf: "center",
        transform: [{ scale: animatedValue }],
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { book: item })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.card}>
          {/* Book Cover */}
          <View style={[styles.coverContainer, { width: coverWidth, height: coverHeight }]}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={[styles.coverImage, { width: coverWidth, height: coverHeight }]}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.coverPlaceholder, { width: coverWidth, height: coverHeight }]}>
                <Ionicons name="book-outline" size={24} color={colors.textMuted} />
              </View>
            )}
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Author */}
            <View style={styles.authorRow}>
              <Ionicons name="person-outline" size={11} color={colors.textMuted} />
              <Text style={styles.author} numberOfLines={1}>
                {item.author}
              </Text>
            </View>

            {/* Description Preview */}
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              {item.category ? (
                <View style={styles.categoryBadge}>
                  <Ionicons name="pricetag-outline" size={9} color={colors.textLight} />
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              ) : (
                <View style={styles.spacer} />
              )}

              {/* Availability */}
              <View style={[
                styles.availabilityBadge,
                { backgroundColor: item.available ? colors.success : colors.error }
              ]}>
                <Ionicons 
                  name={item.available ? "checkmark-circle" : "close-circle"} 
                  size={10} 
                  color={colors.surface} 
                />
                <Text style={styles.availabilityText}>
                  {item.available ? "Disp." : "Prest."}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  coverContainer: {
    backgroundColor: colors.surfaceAlt,
  },
  coverImage: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  coverPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 17,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  author: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  description: {
    fontSize: 10,
    color: colors.textLight,
    lineHeight: 14,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  categoryText: {
    fontSize: 9,
    color: colors.textLight,
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  availabilityText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: "700",
  },
});

export default BookItem;
