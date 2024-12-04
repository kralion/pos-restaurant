import { IOrder } from "@/interfaces";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Card, IconButton } from "react-native-paper";

export default function MenuCard({ menu }: { menu: IOrder }) {
  return (
    <Card
      style={{
        marginHorizontal: 10,
        marginVertical: 8,
      }}
      onPress={() => {
        router.push(`/(tabs)/menu/details/${menu.id}`);
      }}
    >
      <Card.Title
        title="Arroz con Pollo"
        subtitle="S/. 12.00"
        left={(props) => (
          <Image
            source={{
              uri: "https://img.freepik.com/free-photo/chicken-fajita-chicken-fillet-fried-with-bell-pepper-lavash-with-bread-slices-white-plate_114579-174.jpg?ga=GA1.1.492447503.1733309013&semt=ais_tags_boosted",
            }}
            style={{ width: 50, height: 50, borderRadius: 10 }}
          />
        )}
        right={(props) => <IconButton {...props} icon="chevron-right" />}
      />
    </Card>
  );
}
