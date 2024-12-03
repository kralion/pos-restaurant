import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function EmployeesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="orders"
        options={{
          title: "Pedidos",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
            cancelButtonText: "Cancelar",
          },

          headerLargeTitleShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="receipt"
        options={{
          title: "Detalles",
          headerBackTitle: "Pedidos",
          headerLargeTitle: true,
          headerBlurEffect: "regular",
          headerBackVisible: true,
          headerTransparent: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          headerShown: false,
          presentation: "modal",
          headerRight: () => (
            <Button title="Cerrar" onPress={() => router.back()} />
          ),
        }}
      />
    </Stack>
  );
}
