import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { set } from "react-hook-form";
import { Image, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  Modal,
  Portal,
  Switch,
  Text,
} from "react-native-paper";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>();
  const [paid, setPaid] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { getOrderById } = useOrderContext();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order);
      if (order) {
        setPaid(order.paid);
      }
    });
  }, [params.id]);
  React.useEffect(() => {
    const channel = supabase
      .channel("table-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async () => {
          const { data, error } = await supabase.from("orders").select("*");
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  if (!order) return <ActivityIndicator />;

  const subTotal =
    order.entradas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order.bebidas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order.fondos.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

  const total = subTotal + subTotal * 0.18;
  const updatePaidStatus = async (id: string, paid: boolean) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ paid })
      .eq("id", id)
      .select();
  };
  const handleSwitchChange = () => {
    setModalVisible(!modalVisible);
    setPaid(!paid);
    console.log("changepid 2", paid);
  };

  const confirmUpdate = () => {
    if (order?.id) {
      updatePaidStatus(order.id, paid);
    }
    setModalVisible(false);
  };
  return (
    <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-12">
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>Mesa</Text>
            <Text> {order.table}</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text>Mozo</Text>
            <Text>{order?.users?.name}</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              {order.paid ? "Orden Pagada" : "Orden sin pagar"}
            </Text>
            <Switch value={paid} onValueChange={handleSwitchChange} />
          </View>
        </View>

        <View className="flex flex-col gap-4">
          <Text variant="titleMedium">Orden</Text>
          <Divider />
          <View className="flex flex-col gap-4">
            <View className="flex flex-row justify-between">
              <Text variant="bodySmall" className="w-48">
                Entradas
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
          <Divider />
          <View className="flex flex-col gap-4">
            <Text variant="bodySmall" className="w-48 ">
              Fondos
            </Text>
            {order.fondos.map((item, index) => (
              <View
                key={index}
                className="flex flex-row w-full justify-between"
              >
                <Text className="w-36">{item.name}</Text>
                <Text>S/. {item.price}</Text>
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
                <Text>S/. {item.price}</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>
          <Divider />
        </View>

        <Divider className="border-dashed border-2" />
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>SubTotal</Text>
            <Text>S/. {subTotal.toFixed(2)}</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text>Impuestos</Text>
            <Text>S/. {(subTotal * 0.18).toFixed(2)}</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text>Total</Text>
            <Text variant="titleLarge">S/. {total.toFixed(2)}</Text>
          </View>
        </View>
        {order.paid && (
          <Button
            mode="contained"
            onPress={() => alert("Conecte la impresora")}
          >
            Imprimir Boleta
          </Button>
        )}
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
            <Button mode="contained" onPress={confirmUpdate}>
              Confirmar
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}
