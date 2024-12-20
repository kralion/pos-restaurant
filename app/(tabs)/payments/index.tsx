import OrderCard from "@/components/payment-card";
import { useOrderContext } from "@/context";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function HomeScreen() {
  const { paidOrders, getPaidOrders, loading } = useOrderContext();

  React.useEffect(() => {
    getPaidOrders();
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className=" bg-white flex-1"
    >
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      <FlashList
        renderItem={({ item: order }) => <OrderCard order={order} />}
        data={paidOrders}
        estimatedItemSize={200}
        horizontal={false}
      />
      {paidOrders?.length === 0 && (
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
