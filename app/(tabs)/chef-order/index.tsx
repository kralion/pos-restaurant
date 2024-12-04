import OrderCard from "@/components/chef/order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const [orders, setOrders] = React.useState<IOrder[]>();
  const { getUnservedOrders } = useOrderContext();
  React.useEffect(() => {
    getUnservedOrders().then((orders) => setOrders(orders));
  }, []);
  if (!orders) return <ActivityIndicator />;
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
