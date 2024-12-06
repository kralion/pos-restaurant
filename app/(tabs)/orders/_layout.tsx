import { useOrderContext } from "@/context";
import { router, Stack } from "expo-router";
import React from "react";
import { Alert, Button } from "react-native";

export default function WaiterLayout() {
  const { deleteOrder, order } = useOrderContext();
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
          title: "Pedidos",
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
            title: "Mesa " + order.id_table,
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
