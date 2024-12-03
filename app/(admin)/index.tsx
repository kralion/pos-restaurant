import OrderCard from "@/components/admin/order-card";
import { useUserContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Divider } from "react-native-paper";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { setUserLogout } = useUserContext();
  const orders = [
    { id: 1, name: "Mesa #1", people: 2, price: 100 },
    { id: 2, name: "Silla #2", people: 2, price: 100 },
    { id: 3, name: "Mesa #3", people: 2, price: 100 },
    { id: 4, name: "Mesa #4", people: 2, price: 100 },
  ];

  const filteredOrders = React.useMemo(() => {
    if (!search) return orders;

    const lowercasedSearch = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.name.toLowerCase().includes(lowercasedSearch) ||
        order.id.toString().includes(lowercasedSearch)
    );
  }, [search, orders]);
  return (
    <SafeAreaView className="">
      <View className="flex flex-row justify-between p-4">
        <View>
          <Text className=" text-4xl font-bold">Ordenes del Día</Text>
          <Text className=" opacity-50">Listado de pedidos </Text>
        </View>
        <Button color="red" title="Salir" onPress={() => setUserLogout()} />
      </View>
      <Divider style={{ marginTop: 16 }} />
      <ScrollView className="min-h-screen p-4">
        <FlashList
          renderItem={({ item: order }) => <OrderCard order={order} />}
          data={filteredOrders}
          estimatedItemSize={200}
          horizontal={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
