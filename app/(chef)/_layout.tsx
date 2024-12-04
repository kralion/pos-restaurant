import { useUserContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function ChefLayout() {
  const { setUserLogout } = useUserContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
            cancelButtonText: "Cancelar",
          },
          headerRight: () => (
            <Button title="Salir" onPress={() => setUserLogout()} color="red" />
          ),
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="order/[id]"
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
