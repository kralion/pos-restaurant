import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Categorías",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add-category"
        options={() => {
          return {
            title: "Agregar Categoría",
            presentation: "modal",
            headerShadowVisible: false,
            headerRight: () => (
              <Button
                title="Cancelar"
                color="#FF6247"
                onPress={() => router.back()}
              />
            ),
          };
        }}
      />
    </Stack>
  );
}
