import { View, Text, ScrollView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { useState, useEffect } from "react";
  interface Order {
    id: number;
    item: string;
    status: "pending" | "attended";
  }

  const ordersData: Order[] = [
    { id: 1, item: "Pizza", status: "pending" },
    { id: 2, item: "Burger", status: "attended" },
    { id: 3, item: "Pasta", status: "pending" },
  ];

  export default function HomeScreen() {
    const headerHeight = useHeaderHeight();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
      // Simulate fetching data from an API
      setOrders(ordersData);
    }, []);

    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        style={{
          paddingTop: headerHeight,
          minHeight: "100%",
        }}
      >
        <Text>Orders</Text>
        {orders.map((order) => (
          <View key={order.id} style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>Item: {order.item}</Text>
            <Text>Status: {order.status}</Text>
          </View>
        ))}
      </ScrollView>
    );
}
