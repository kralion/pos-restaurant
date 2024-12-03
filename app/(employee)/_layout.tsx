import { OrderContextProvider } from "@/context/order";
import { router, Stack } from "expo-router";
import React from "react";
export default function EmployeesLayout() {
  return (
    <OrderContextProvider>
      <Stack>
        <Stack.Screen
          name="index"
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

            headerLargeTitleShadowVisible: false,
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
    </OrderContextProvider>
  );
}
