import { useCategoryContext } from "@/context/category";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView } from "react-native";
import { Card, FAB, IconButton, Text } from "react-native-paper";

export default function CategoriesScreen() {
  const { deleteCategory, getCategories, categories } = useCategoryContext();
  React.useEffect(() => {
    getCategories();
  }, []);

  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar esta categoría?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory(id);
          } catch (error: any) {
            alert("Error al eliminar: " + error.message);
          }
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <FlashList
          renderItem={({ item: category }) => (
            <Card
              key={category.id}
              style={{
                marginHorizontal: 16,
                marginVertical: 8,
              }}
            >
              <Card.Title
                title={`${category.name}`}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete-outline"
                    onPress={() => onDelete(category.id || "")}
                  />
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium" style={{ color: "gray" }}>
                  {category.description}
                </Text>
              </Card.Content>
            </Card>
          )}
          data={categories}
          estimatedItemSize={200}
          horizontal={false}
        />
      </ScrollView>

      <FAB
        icon="book-plus-multiple-outline"
        variant="tertiary"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => router.push("/(tabs)/profile/categories/add-category")}
      />
    </>
  );
}
