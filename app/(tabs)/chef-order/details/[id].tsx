import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Divider, Modal, Portal, Text } from "react-native-paper";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { updateOrderServedStatus, getOrderById } = useOrderContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [order, setOrder] = useState<IOrder>();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => setOrder(order));
  }, [params.id]);

  if (!order) return <Text>Loading...</Text>;

  return (
    <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-12 mb-10">
        <View className="flex flex-col gap-3">
          <Divider className="border-dashed border-2" />
          <View className="flex flex-row justify-between">
            <Text variant="titleLarge">Mesa</Text>
            <Text variant="titleLarge"> {order.table}</Text>
          </View>
          <Divider />
        </View>

        <View className="flex flex-col gap-4">
          <Text variant="titleMedium">Orden</Text>
          <Divider />
          <View className="flex flex-col gap-4">
            <View className="flex flex-row justify-between">
              <Text variant="bodySmall" className="w-48">
                Entradas
              </Text>
              <Text variant="bodySmall">Cantidad</Text>
            </View>
            {order.entradas.map((item, index) => (
              <View key={index} className="flex flex-row justify-between">
                <Text className="w-36">{item.name}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>
          <Divider />
          <View className="flex flex-col gap-4">
            <Text variant="bodySmall" className="w-48 ">
              Bebidas
            </Text>

            {order.bebidas.map((item, index) => (
              <View
                key={index}
                className="flex flex-row w-full justify-between"
              >
                <Text className="w-36">{item.name}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>
        <Divider className="border-dashed border-2" />
      </View>
      <Button
        mode="contained"
        onPress={() => {
          setModalVisible(true);
        }}
      >
        Preparado
      </Button>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View className="p-4 bg-white mx-4 rounded-lg flex flex-col gap-16">
            <View className="flex flex-row gap-4 items-center">
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={{
                  uri: "https://img.icons8.com/?size=100&id=VQOfeAx5KWTK&format=png&color=000000",
                }}
              />
              <View className="flex flex-col gap-1">
                <Text variant="titleMedium">Estado del pedido</Text>
                <Text>El estado cambiará a </Text>
                <Text> servido, estás seguro ?</Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => {
                updateOrderServedStatus(order.id ? order.id : "");
                setModalVisible(false);
                router.push("/(tabs)/chef-order");
              }}
            >
              Aceptar
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}
