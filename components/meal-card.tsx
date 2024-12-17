import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import React from "react";
import { Card, IconButton, Text } from "react-native-paper";

export default function MealCard({ meal }: { meal: IMeal }) {
  const { deleteMeal } = useMealContext();
  return (
    <Card
      style={{
        margin: 20,
        backgroundColor: "white",
      }}
    >
      <Card.Cover
        source={{
          uri: meal.image_url,
        }}
      />
      <Card.Title
        title={meal.name}
        subtitle={` ${meal.quantity} porciones`}
        subtitleStyle={{ fontSize: 14, color: "gray" }}
      />
      <Card.Content className="flex flex-row justify-between items-center">
        <Text variant="titleLarge">{`S/. ${meal.price.toFixed(2)}`}</Text>
        <IconButton
          mode="contained"
          icon="delete-outline"
          onPress={() => {
            deleteMeal(meal.id);
            alert("Eliminado");
          }}
        />
      </Card.Content>
    </Card>
  );
}
