import { router, Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function EmployeesLayout() {
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
        }}
      />
    </Stack>
  );
}
