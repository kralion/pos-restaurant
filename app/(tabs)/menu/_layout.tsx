import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Menú del Día",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerBlurEffect: "regular",
          headerTransparent: true,

          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: true,
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
        name="add-meal"
        options={{
          title: "Agregar Item",
          headerBackTitle: "Menú",
          headerLargeTitle: true,
          presentation: "modal",
          headerBackVisible: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerRight: () => (
            <Button
              title="Cancelar"
              color="red"
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
