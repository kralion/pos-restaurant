import OrderCard from "@/components/order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function OrdersScreen() {
  const { getUnpaidOrders, loading } = useOrderContext();
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const unpaidOrders = await getUnpaidOrders();
      setOrders(unpaidOrders);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setRefreshing(false);
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

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className=" bg-white flex-1 "
    >
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
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
      {orders?.length === 0 && (
        <View className="flex flex-col gap-4 items-center justify-center mt-20">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=200&id=119481&format=png&color=000000",
            }}
            style={{ width: 100, height: 100 }}
          />
          <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
        </View>
      )}
    </ScrollView>
  );
}
