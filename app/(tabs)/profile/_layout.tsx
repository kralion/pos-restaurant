import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Perfil",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: "Usuarios",
          headerBackTitle: "Pedidos",
          headerLargeTitle: true,
          headerBackVisible: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="daily-report"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Reporte",
            headerBackTitle: "Pedidos",
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: false,
            headerLargeTitleShadowVisible: false,
          };
        }}
      />
    </Stack>
  );
}
