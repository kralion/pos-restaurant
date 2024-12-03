import { useUserContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function EmployeesLayout() {
  const { setUserLogout } = useUserContext();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Tomar Orden",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerRight: () => (
            <Button title="Salir" onPress={() => setUserLogout()} color="red" />
          ),
        }}
      />
    </Stack>
  );
}
