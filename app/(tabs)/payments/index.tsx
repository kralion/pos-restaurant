import OrderCard from "@/components/waiter/order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text } from "react-native";
import { Divider } from "react-native-paper";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { getPaidOrders } = useOrderContext();
  const [orders, setOrders] = React.useState<IOrder[]>([]);

  React.useEffect(() => {
    getPaidOrders().then((orders) => {
      setOrders(orders);
    });
  }, []);

  console.log(JSON.stringify(orders));

  const filteredOrders = React.useMemo(() => {
    if (!search) return orders;

    const lowercasedSearch = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.table.toString().includes(lowercasedSearch) ||
        order.entradas.toString().includes(lowercasedSearch)
    );
  }, [search, orders]);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="min-h-screen p-4"
    >
      <Text className=" text-4xl font-bold">Pagos</Text>
      <Text className=" opacity-50">Listado de pedidos pagados</Text>
      <Divider style={{ marginVertical: 16 }} />
      <FlashList
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={filteredOrders}
        estimatedItemSize={200}
        horizontal={false}
      />
    </ScrollView>
  );
}
