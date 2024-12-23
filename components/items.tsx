import { useCategoryContext } from "@/context/category";
import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Divider,
  IconButton,
  List,
  Text,
} from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function OrderItemsAccordion({
  items,
  setItems,
}: {
  items: IMeal[];
  setItems: React.Dispatch<React.SetStateAction<IMeal[]>>;
}) {
  const {
    categories,
    getCategories,
    loading: categoriesLoading,
  } = useCategoryContext();
  const { getMealsByCategoryId, loading: mealsLoading } = useMealContext();
  const [mealsByCategory, setMealsByCategory] = useState<IMeal[]>([]);
  const handleQuantityChange = (item: IMeal, quantity: number) => {
    const newItemsSelected = [...items];
    const index = newItemsSelected.findIndex((i) => i.id === item.id);
    if (quantity > 0) {
      if (index === -1) {
        newItemsSelected.push({ ...item, quantity });
      } else {
        newItemsSelected[index] = { ...newItemsSelected[index], quantity };
      }
    } else {
      if (index !== -1) {
        newItemsSelected.splice(index, 1);
      }
    }

    setItems(newItemsSelected);
  };

  const mealsByCategoryHandler = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    getMealsByCategoryId(category.id as string).then((meals) => {
      setMealsByCategory(meals);
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {categoriesLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {categories.map((category, index) => (
        <List.Section key={category.id}>
          <List.Accordion
            style={{
              backgroundColor: "white",
              paddingTop: 0,
              marginTop: 0,
            }}
            title={category.name}
            onPress={() => mealsByCategoryHandler(category.id as string)}
          >
            {mealsLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
            <FlashList
              data={mealsByCategory}
              estimatedItemSize={74}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item, index }) => (
                <ItemAccordion
                  item={item}
                  index={index}
                  currentQuantity={
                    items.find((i) => i.id === item.id)?.quantity || 0
                  }
                  onQuantityChange={handleQuantityChange}
                />
              )}
              ListEmptyComponent={
                <View className="p-4 items-center">
                  <Text variant="bodyMedium" style={{ color: "gray" }}>
                    Sin elementos
                  </Text>
                </View>
              }
              keyExtractor={(item) => item.id}
            />
          </List.Accordion>
          {index !== categories.length - 1 && <Divider />}
        </List.Section>
      ))}
    </>
  );
}

const ItemAccordion = ({
  item,
  index,
  currentQuantity = 0,
  onQuantityChange,
}: {
  item: IMeal;
  index: number;
  currentQuantity: number;
  onQuantityChange: (item: IMeal, quantity: number) => void;
}) => {
  const [orderItemQuantity, setOrderItemQuantity] = useState(currentQuantity);
  useEffect(() => {
    setOrderItemQuantity(currentQuantity);
  }, [currentQuantity]);

  const handleQuantityUpdate = useCallback(
    (newQuantity: number) => {
      const validQuantity = Math.max(0, newQuantity);
      setOrderItemQuantity(validQuantity);
      onQuantityChange(item, validQuantity);
    },
    [onQuantityChange]
  );

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(index * 100)}>
      <List.Item
        style={{
          backgroundColor: index % 2 === 0 ? "#F3F3F3" : "white",
        }}
        title={
          <View>
            <Text>{item.name}</Text>
          </View>
        }
        description={
          <View className="flex-row items-center gap-2">
            <Text variant="labelSmall" style={{ color: "gray" }}>
              S/. {item.price.toFixed(2)}
            </Text>
            <Text variant="labelSmall" style={{ color: "gray" }}>
              - {item.quantity} porciones
            </Text>
          </View>
        }
        right={(props) => (
          <View className="flex-row items-center gap-2">
            <IconButton
              onPress={() => handleQuantityUpdate(orderItemQuantity - 1)}
              disabled={orderItemQuantity === 0}
              mode="contained-tonal"
              icon="minus"
            />
            <Text variant="titleLarge">{orderItemQuantity}</Text>
            <IconButton
              mode="contained-tonal"
              onPress={() => handleQuantityUpdate(orderItemQuantity + 1)}
              icon="plus"
            />
          </View>
        )}
      />
    </Animated.View>
  );
};
