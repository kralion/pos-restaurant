import OrderCard from "@/components/chef-order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen() {
  const [orders, setOrders] = React.useState<IOrder[]>();
  const { getUnservedOrders } = useOrderContext();
  React.useEffect(() => {
    getUnservedOrders().then((orders) => setOrders(orders));
  }, []);
  if (!orders) return <ActivityIndicator />;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="min-h-screen"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      
      <FlashList
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={orders}
        estimatedItemSize={200}
        horizontal={false}
      />
    </ScrollView>
  );
}
