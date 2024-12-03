import OrderCard from "@/components/employee/order-card";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const [orders, setOrders] = React.useState([
    {
      id: 1,
      name: "Mesa #1",
      people: 2,
      price: 100,
    },
    {
      id: 2,
      name: "Mesa #2",
      people: 2,
      price: 100,
    },
    {
      id: 3,
      name: "Mesa #3",
      people: 2,
      price: 100,
    },
    {
      id: 4,
      name: "Mesa #4",
      people: 2,
      price: 100,
    },
  ]);
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      className="min-h-screen"
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
