import OrderCard from "@/components/employee/order-card";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
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
