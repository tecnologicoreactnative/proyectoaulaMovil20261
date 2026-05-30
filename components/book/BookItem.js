import React, { useState } from "react";
import { Animated, TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../colors";

export function BookItem({ item, itemSize, navigation }) {
  const [animatedValue] = useState(new Animated.Value(1));
  const [imageError, setImageError] = useState(false);

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
            {item.image && !imageError ? (
              <Image
                source={{ uri: item.image }}
                style={[styles.coverImage, { width: coverWidth, height: coverHeight }]}
                resizeMode="cover"
                onError={() => setImageError(true)}
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
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  coverContainer: {
    backgroundColor: colors.surfaceAlt,
    overflow: "hidden",
  },
  coverImage: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  coverPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  author: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
    fontWeight: "500",
  },
  description: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 15,
    marginTop: 6,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  availabilityText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default BookItem;
