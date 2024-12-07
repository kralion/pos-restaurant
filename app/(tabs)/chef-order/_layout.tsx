import { useOrderContext } from "@/context";
import { Stack } from "expo-router";
import React from "react";

export default function ChefLayout() {
  const { order } = useOrderContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Mesa " + order.id_table,
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
