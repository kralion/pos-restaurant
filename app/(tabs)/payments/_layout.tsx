import { router, Stack } from "expo-router";
import React from "react";
export default function PaymentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Pedidos Pagados",
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
            cancelButtonText: "Cancelar",
            onChangeText: (event) => {
              const search = event.nativeEvent.text;
              router.setParams({
                search: search,
              });
            },

            onCancelButtonPress: () => {
              router.setParams({
                search: undefined,
              });
            },
          },
        }}
      />
      <Stack.Screen
        name="receipt/[id]"
        options={{
          title: "Detalles",
          headerBackTitle: "Pagos",
          headerLargeTitle: true,
          headerBackVisible: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
}
