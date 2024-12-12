import { IOrder } from "@/interfaces";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Avatar, Card, IconButton, Text } from "react-native-paper";
export default function OrderCard({ order }: { order: IOrder }) {
  const formattedDate = new Date(order.date ?? new Date()).toLocaleString(
    "es-ES",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  return (
    <Card
      style={{
      marginHorizontal: 10,
      marginVertical: 8,
      }}
      onPress={() => {
      router.push(`/(tabs)/orders/details/${order.id}`);
      }}
    >
      <Card.Title
      title={"Mesa " + order.id_table}
      titleStyle={{ fontWeight: "bold", fontSize: 16 }}
      subtitle={`${order.served ? "Servido" : "En espera"} • ${order.paid ? "Pagado" : "Pendiente"}`}
      subtitleStyle={{ fontSize: 13 }}
      left={(props) => (
        <Avatar.Icon
        color="white"
        {...props}
        icon={order.served ? "food" : "alert-decagram-outline"}
        />
      )}
      right={(props) => (
        <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text variant="bodyMedium">{formattedDate}</Text>
        <IconButton {...props} icon="chevron-right" />
        </View>
        {order.free && (
          <View
          style={{
            backgroundColor: "green",
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginBottom: 8,
          }}
          >
          <Text variant="bodyMedium" style={{ color: "white" }}>
            Pedido Gratis
          </Text>
          </View>
        )}
        </View>
      )}
      />
    </Card>
  );
}
