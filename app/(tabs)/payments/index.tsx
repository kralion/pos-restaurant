import OrderCard from "@/components/payment-card";
import { useOrderContext } from "@/context";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { paidOrders: orders, getPaidOrders } = useOrderContext();

  React.useEffect(() => {
    getPaidOrders();
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          getPaidOrders();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const filteredOrders = React.useMemo(() => {
    if (!search) return orders;
    const lowercasedSearch = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.fondos.toString().includes(lowercasedSearch) ||
        order.entradas.toString().includes(lowercasedSearch)
    );
  }, [search, orders]);
  if (!orders) return <ActivityIndicator />;
  return (
    <FlashList
      contentContainerStyle={{
        paddingTop: 160, // Adjust this value as needed
      }}
      renderItem={({ item: order }) => <OrderCard order={order} />}
      data={filteredOrders}
      estimatedItemSize={200}
      horizontal={false}
    />
  );
}
