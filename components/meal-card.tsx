import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import React from "react";
import { Button, Card } from "react-native-paper";

export default function MealCard({ meal }: { meal: IMeal }) {
  const { deleteMeal } = useMealContext();
  return (
    <Card
      style={{
        marginHorizontal: 10,
        marginVertical: 8,
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
        subtitleStyle={{ fontSize: 16 }}
        right={(props) => <Button mode="text">{`S/. ${meal.price}`}</Button>}
      />
      <Card.Actions>
        <Button
          onPress={() => {
            deleteMeal(meal.id);
            alert("Eliminado");
          }}
        >
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );
}
