import { IOrder } from "@/interfaces";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Avatar,
  Card,
  IconButton,
} from "react-native-paper";

export default function PaymentCard({ order }: { order: IOrder }) {
  if (!order.date) return <ActivityIndicator />;
  const formattedDate = new Date(order.date).toLocaleDateString();

  return (
    <Card
      style={{
        marginHorizontal: 10,
        marginVertical: 8,
      }}
      onPress={() => {
        router.push(`/(tabs)/payments/receipt/${order.id}`);
      }}
    >
      <Card.Title
        title={"Mesa #" + order.id_table}
        titleStyle={{ fontWeight: "bold" }}
        subtitle={`${formattedDate}`}
        left={(props) => (
          <Avatar.Icon
            color="white"
            {...props}
            icon={order.served ? "food" : "alert-decagram-outline"}
          />
        )}
        right={(props) => <IconButton {...props} icon="chevron-right" />}
      />
    </Card>
  );
}
