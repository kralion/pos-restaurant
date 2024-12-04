import { Stack } from "expo-router";
import React from "react";

export default function ChefLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Detalles",
          headerBackTitle: "Pedidos",
          headerLargeTitle: true,
          headerBackVisible: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
}
