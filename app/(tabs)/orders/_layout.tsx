import { useOrderContext } from "@/context";
import { Stack } from "expo-router";
import React from "react";

export default function WaiterLayout() {
  const { order } = useOrderContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerShown: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Mesa " + order.id_table,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          //TODO: Premium Feature
          // headerRight: () => {
          //   return order.paid ? null : (
          //     <Button
          //       title="Editar"
          //       color="#FF6247"
          //       onPress={() => {
          //         router.push({
          //           pathname: "/add-order",
          //           params: { number: order.id_table, id_order: order.id },
          //         });
          //       }}
          //     />
          //   );
          // },
        }}
      />
    </Stack>
  );
}
