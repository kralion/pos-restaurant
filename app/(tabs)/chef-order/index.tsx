import OrderCard from "@/components/chef-order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen() {
  const [orders, setOrders] = React.useState<IOrder[]>();
  const { getUnservedOrders, loading } = useOrderContext();
  React.useEffect(() => {
    getUnservedOrders().then((orders) => setOrders(orders));
  }, [orders]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="min-h-screen"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      <FlashList
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={orders}
        estimatedItemSize={200}
        horizontal={false}
      />
    </ScrollView>
  );
}
