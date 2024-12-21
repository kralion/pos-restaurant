import OrderCard from "@/components/order-card";
import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

export default function OrdersScreen() {
  const { getUnpaidOrders, loading } = useOrderContext();
  const [orders, setOrders] = React.useState<IOrder[]>([]);

  async function onRefresh() {
    getUnpaidOrders().then((orders) => {
      setOrders(orders);
    });
  }

  React.useEffect(() => {
    getUnpaidOrders().then((orders) => {
      setOrders(orders);
    });
  }, []);

  return (
    <>
      <Appbar.Header
        style={{
          borderBottomColor: "#f1f1f1",
          borderBottomWidth: 0.5,
        }}
      >
        <Appbar.Content
          titleStyle={{
            fontWeight: "bold",
          }}
          title="Pedidos Recientes"
        />
      </Appbar.Header>
      <View className="flex-1 ">
        <FlashList
          contentContainerStyle={{
            paddingVertical: 16,
          }}
          renderItem={({ item: order }) => <OrderCard order={order} />}
          data={orders}
          refreshing={loading}
          onRefresh={onRefresh}
          estimatedItemSize={200}
          ListEmptyComponent={
            <View className="flex flex-col gap-4 items-center justify-center mt-20">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=200&id=119481&format=png&color=000000",
                }}
                style={{ width: 100, height: 100 }}
              />
              <Text style={{ color: "gray" }}>No hay items para mostrar</Text>
            </View>
          }
          horizontal={false}
        />
      </View>
    </>
  );
}
