import { useOrderContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function WaiterLayout() {
  const { order } = useOrderContext();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos",
          headerShown: false,
          // headerSearchBarOptions: {
          //   placeholder: "Buscar ...",
          //   hideWhenScrolling: true,
          //   cancelButtonText: "Cancelar",
          //   onChangeText: (event) => {
          //     const search = event.nativeEvent.text;
          //     router.setParams({
          //       search: search,
          //     });
          //   },
          //   onCancelButtonPress: () => {
          //     router.setParams({
          //       search: undefined,
          //     });
          //   },
          // },
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Mesa " + order.id_table,
          headerRight: () => {
            return order.paid ? null : (
              <Button
                title="Editar"
                color="#FF6247"
                onPress={() => {
                  router.push({
                    pathname: "/add-order",
                    params: { number: order.id_table, id_order: order.id },
                  });
                }}
              />
            );
          },
        }}
      />
    </Stack>
  );
}
