import { OrderContextProvider } from "@/context/order";
import { router, Stack } from "expo-router";
import React from "react";
export default function PaymentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="receipt/[id]"
        options={{
          title: "Detalles",
          headerBackTitle: "Pedidos",
          headerLargeTitle: true,
          headerBackVisible: true,
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
}
