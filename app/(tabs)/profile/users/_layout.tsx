import { useOrderContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
import { Alert, Button } from "react-native";

export default function UserLayout() {
  const { deleteOrder } = useOrderContext();
  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      {
        text: "Sí",
        onPress: () => {
          deleteOrder(id).then(() => {
            alert("Pedido eliminado");
            router.back();
          });
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Users",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add-user"
        options={() => {
          return {
            title: "Agregar Usuario",
            headerBackTitle: "Pedidos",
            headerLargeTitle: true,
            headerBackVisible: true,
            presentation: "modal",
            headerShadowVisible: false,
            headerLargeTitleShadowVisible: false,
            headerRight: () => (
              <Button title="Cancelar" onPress={() => router.back()} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="user/[id]"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Detalles Usuario",
            headerBackTitle: "Pedidos",
            headerLargeTitle: true,
            headerBackVisible: true,
            headerShadowVisible: false,
            headerLargeTitleShadowVisible: false,
            headerRight: () => (
              <Button
                title="Eliminar"
                color="red"
                onPress={() => onDelete(id)}
              />
            ),
          };
        }}
      />
    </Stack>
  );
}
