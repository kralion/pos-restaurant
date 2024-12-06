import OrderCard from "@/components/order-card";
import { useOrderContext } from "@/context";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { orders, getOrders } = useOrderContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    try {
      await getOrders();
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [getOrders]);

  const filteredOrders = React.useMemo(() => {
    if (!search) return orders;
    const lowercasedSearch = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.table.toString().includes(lowercasedSearch) ||
        order.entradas.toString().includes(lowercasedSearch)
    );
  }, [search, orders]);

  if (!orders) return <ActivityIndicator />;
  if (isLoading && !orders?.length) return <ActivityIndicator />;
  return (
    // <ScrollView
    //   contentInsetAdjustmentBehavior="automatic"
    //   keyboardDismissMode="on-drag"
    //   className="min-h-screen"
    // >
    // </ScrollView>
    <SafeAreaView style={{ flex: 1 }}>
      <FlashList
        contentContainerStyle={{
          paddingTop: 160, // Adjust this value as needed
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={filteredOrders}
        estimatedItemSize={200}
        horizontal={false}
      />
    </SafeAreaView>
  );
}
