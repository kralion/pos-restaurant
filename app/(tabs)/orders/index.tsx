import OrderCard from "@/components/order-card";
import { useOrderContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";

export default function OrdersScreen() {
  const { getUnpaidOrders } = useOrderContext();
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    try {
      const unpaidOrders = await getUnpaidOrders();
      setOrders(unpaidOrders);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [getUnpaidOrders]);

  React.useEffect(() => {
    // Suscripción a cambios en la tabla orders
    const subscription = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async (payload) => {
          // Recargar las órdenes cuando haya cambios
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE" ||
            payload.eventType === "DELETE"
          ) {
            await onRefresh();
          }
        }
      )
      .subscribe();
    onRefresh();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading && !orders?.length) return <ActivityIndicator />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className=" bg-white flex-1"
    >
      <FlashList
        style={{
          backgroundColor: "#fff",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={orders}
        estimatedItemSize={200}
        horizontal={false}
      />
    </ScrollView>
  );
}
