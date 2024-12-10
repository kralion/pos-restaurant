import { CustomerContextProvider } from "@/context/customer";
import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function CustomerLayout() {
  return (
    <CustomerContextProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Customers",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="add-customer"
          options={() => {
            return {
              title: "Agregar Cliente",
              headerLargeTitle: true,
              presentation: "modal",
              headerShadowVisible: false,
              headerRight: () => (
                <Button title="Cancelar" onPress={() => router.back()} />
              ),
            };
          }}
        />
      </Stack>
    </CustomerContextProvider>
  );
}
