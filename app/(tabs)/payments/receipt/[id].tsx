import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Divider, Modal, Portal, Text } from "react-native-paper";

export default function ReceiptScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>();
  const { getOrderById } = useOrderContext();
  const [paid, setPaid] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  React.useEffect(() => {
    getOrderById(params.id).then((order) => setOrder(order));
  }, [params.id]);
  if (!order) return <Text>Loading...</Text>;
  const subTotal =
    order.entradas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order.bebidas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

  const total = subTotal + subTotal * 0.18;

  return (
    <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-12">
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>Mozo</Text>
            <Text>Jhon Doe</Text>
          </View>
          <Divider />
        </View>

        <View className="flex flex-col gap-4">
          <Text variant="titleMedium">Orden</Text>
          <Divider />
          <View className="flex flex-col gap-4">
            <View className="flex flex-row justify-between">
              <Text variant="bodySmall" className="w-48">
                Item
              </Text>
              <Text variant="bodySmall">Precio</Text>
              <Text variant="bodySmall">Cantidad</Text>
            </View>
            {order.entradas.map((item, index) => (
              <View key={index} className="flex flex-row justify-between">
                <Text className="w-36">{item.name}</Text>
                <Text>S/. {item.price}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>

          {order.bebidas.map((item, index) => (
            <View key={index} className="flex flex-row w-full justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>S/. {item.price}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}
        </View>

        <Divider className="border-dashed border-2" />
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>SubTotal</Text>
            <Text>S/. {subTotal}</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text>Impuestos</Text>
            <Text>S/. {(subTotal * 0.18).toFixed(2)}</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text>Total</Text>
            <Text variant="titleLarge">S/. {total}</Text>
          </View>
        </View>
      </View>
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
                <Text>Estas seguro de cambiar el </Text>
                <Text> estado de la orden ?</Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => {
                setPaid(!paid);
                setModalVisible(false);
              }}
            >
              Confirmar
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}
