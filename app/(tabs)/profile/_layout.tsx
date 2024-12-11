import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Mi Perfil",
          headerLargeTitle: false,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: "Usuarios",
          headerLargeTitle: true,
          headerBackVisible: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="customers"
        options={{
          title: "Clientes Fijos",
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
