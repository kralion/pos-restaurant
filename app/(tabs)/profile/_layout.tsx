import { useOrderContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
import { Alert, Button } from "react-native";

export default function ProfileLayout() {
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
          title: "Perfil",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="users"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Usuarios",
          };
        }}
      />
      <Stack.Screen
        name="daily-report"
        options={({ route }) => {
          const { id } = route.params as { id: string };
          return {
            title: "Reporte",
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
