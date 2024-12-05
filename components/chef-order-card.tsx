import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import React from "react";
import { View } from "react-native";
import { Avatar, Button, Card, Divider, Text } from "react-native-paper";

export default function OrderCard({ order }: { order: IOrder }) {
  const { updateOrderServedStatus } = useOrderContext();
  return (
    <Card
      style={{
        margin: 8,
      }}
    >
      <Card.Title
        title={"Mesa " + order.table}
        titleStyle={{ fontSize: 20 }}
        subtitle={order.to_go ? "Para Llevar" : "Para Comer"}
        subtitleStyle={{ fontSize: 12 }}
        left={(props) => <Avatar.Icon color="white" {...props} icon="food" />}
        right={() => (
          <Button
            mode="contained"
            icon="check"
            style={{ marginRight: 8 }}
            onPress={() => {
              updateOrderServedStatus(order.id ? order.id : "");
              alert("Pedido preparado");
            }}
          >
            Preparar
          </Button>
        )}
      />
      <Card.Content>
        <View className="flex flex-col gap-4 ">
          <View className="flex flex-row justify-between">
            <Text variant="titleSmall">Item</Text>
            <Text variant="titleSmall">Cantidad</Text>
          </View>
          <Divider />
          {order.entradas.map((item, index) => (
            <View key={index} className="flex flex-row justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}
          {order.fondos.map((item, index) => (
            <View key={index} className="flex flex-row w-full justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}
          {order.bebidas.map((item, index) => (
            <View key={index} className="flex flex-row w-full justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}
