import OrderCard from "@/components/payment-card";
import { useOrderContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";

export default function HomeScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const {
    paidOrders: orders,
    getPaidOrders: getOrders,
    loading,
  } = useOrderContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const headerHeight = useHeaderHeight();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await getOrders();
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setRefreshing(false);
    }
  }, [getOrders]);
  React.useEffect(() => {
    onRefresh();
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
  if (loading && !orders?.length) return <ActivityIndicator />;
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className=" bg-white flex-1"
    >
      <FlashList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={filteredOrders}
        estimatedItemSize={200}
        horizontal={false}
      />
    </ScrollView>
  );
}
