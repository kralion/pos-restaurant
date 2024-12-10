import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Divider, Text } from "react-native-paper";

export default function ReceiptScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>();
  const { getOrderById } = useOrderContext();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order);
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
          await supabase.from("orders").select("*");
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  if (!order) return <ActivityIndicator />;

  const total =
    order.entradas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order.bebidas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order.fondos.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);


  return (
    <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-12">
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>Atendido por: </Text>
            <Text>{order.users?.name}</Text>
          </View>
          <Divider />
        </View>

        <View className="flex flex-col gap-4">
          <Text variant="titleMedium">Orden</Text>
          <Divider />
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

          {order.fondos.map((item, index) => (
            <View key={index} className="flex flex-row w-full justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>S/. {item.price}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}

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
            <Text variant="titleLarge">Total</Text>
            <Text variant="titleLarge">S/. {total}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
