import React, { useState } from "react";
import { Animated, TouchableOpacity, Image, View, Text } from "react-native";
import { Card, Heading, Body } from ".";
import { colors } from "./colors";

export function BookItem({ item, itemSize, navigation }) {
  const [animatedValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        width: itemSize,
        marginBottom: 16,
        transform: [{ scale: animatedValue }],
      }}
    >
      <TouchableOpacity
        style={{ marginBottom: 12 }}
        onPress={() => navigation.navigate("Details", { book: item })}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Card
          variant="elevated"
          style={{ overflow: "hidden", height: itemSize * 1.4 + 100 }}
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{ width: itemSize, height: itemSize * 1.4 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: itemSize,
                height: itemSize * 1.4,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.surfaceAlt,
              }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                Sin imagen
              </Text>
            </View>
          )}
          <View style={{ padding: 10, flex: 1 }}>
            <Heading
              style={{ fontSize: 14, color: colors.text }}
              numberOfLines={2}
            >
              {item.title}
            </Heading>
            <Body style={{ marginTop: 4, fontSize: 13 }}>{item.author}</Body>
            {item.category && (
              <View
                style={{
                  marginTop: 8,
                  backgroundColor: colors.surfaceAlt,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    fontWeight: "600",
                  }}
                >
                  {item.category}
                </Text>
              </View>
            )}
            {/* Availability badge */}
            <View style={{ marginTop: 8, alignSelf: "flex-start" }}>
              <View
                style={{
                  backgroundColor: item.available
                    ? colors.success
                    : colors.error,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.surface,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  {item.available ? "Disponible" : "No disponible"}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default BookItem;
