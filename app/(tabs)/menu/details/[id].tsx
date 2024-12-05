import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Divider,
  Switch,
  Text,
} from "react-native-paper";

export default function MealDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { getMealById, deleteMeal, meal } = useMealContext();
  React.useEffect(() => {
    getMealById(params.id);
  }, [params.id]);
  if (!meal) return <ActivityIndicator />;

  return (
    <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-12">
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>Descripcion</Text>
            <Text> {meal.name}</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text>Precio</Text>
            <Text>{meal.price}</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              {meal.quantity > 0 ? "En Stock" : "No Disponible"}
            </Text>
            <Switch value={meal.quantity > 0 ? true : false} />
          </View>
        </View>

        <Divider className="bmeal-dashed bmeal-2" />

        {meal.quantity > 0 && (
          <Button mode="contained" onPress={() => deleteMeal(params.id)}>
            Eliminar Item
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
