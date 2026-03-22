import React from 'react';
import { Stack } from 'expo-router';

export default function AuthenticatedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="saludo" />
    </Stack>
  );
}
