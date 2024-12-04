import OrderCard from "@/components/payment-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { getPaidOrders, paidOrders: orders } = useOrderContext();
  React.useEffect(() => {
    getPaidOrders();
  }, []);

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
    <SafeAreaView className="p-4">
      <Divider style={{ marginTop: 16 }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        className="py-4 h-screen-safe"
      >
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
