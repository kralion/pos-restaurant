import OrderCard from "@/components/waiter/order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { supabase } from "@/utils/supabase";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  async function getOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", false)
      .limit(15);
    if (error) throw error;
    return data;
  }

  const filteredOrders = React.useMemo(() => {
    if (!search) return orders;

    const lowercasedSearch = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.table.toString().includes(lowercasedSearch) ||
        order.entradas.toString().includes(lowercasedSearch)
    );
  }, [search, orders]);

  React.useEffect(() => {
    getOrders().then((orders) => {
      setOrders(orders);
    });
  }, []);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="min-h-screen"
    >
      <FlashList
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={filteredOrders}
        estimatedItemSize={200}
        horizontal={false}
      />
    </ScrollView>
  );
}
