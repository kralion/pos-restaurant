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
            presentation: "modal",
            headerShadowVisible: false,
            headerRight: () => (
              <Button title="Cancelar" onPress={() => router.back()} />
            ),
          };
        }}
      />
      <Stack.Screen
        name="user/[id]"
        options={{
          title: "Detalles Usuario",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
