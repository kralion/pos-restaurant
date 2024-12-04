import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Menú",
          headerLargeTitle: true,
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
        name="details/[id]"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Detalles",
            headerBackTitle: "Menú",
            headerLargeTitle: true,
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
          };
        }}
      />
      <Stack.Screen
        name="add-meal"
        options={{
          title: "Detalles",
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
