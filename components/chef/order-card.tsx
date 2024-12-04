import { router } from "expo-router";
import React from "react";
import { Avatar, Card, IconButton } from "react-native-paper";

type TOrder = {
  id: number;
  name: string;
  people: number;
  price: number;
};

export default function OrderCard({ order }: { order: TOrder }) {
  return (
    <Card
      style={{
        marginHorizontal: 10,
        marginVertical: 8,
      }}
      onPress={() => {
        router.push(`/(chef)/order/${order.id}`);
      }}
    >
      <Card.Title
        title={order.name}
        subtitle={order.people + "Personas"}
        left={(props) => <Avatar.Icon {...props} icon="food" />}
        right={(props) => <IconButton {...props} icon="chevron-right" />}
      />
    </Card>
  );
}
