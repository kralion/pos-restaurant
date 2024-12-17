import { useAuth } from "@/context/auth";
import { useCategoryContext } from "@/context/category";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView } from "react-native";
import { Card, FAB, IconButton } from "react-native-paper";

export default function CategoriesScreen() {
  const { deleteCategory, getCategories, categories } = useCategoryContext();
  const { profile } = useAuth();

  React.useEffect(() => {
    if (!profile) return;
    getCategories(profile.id_tenant as string);
  }, [profile]);

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
            <Card key={category.id} style={{ margin: 8 }}>
              <Card.Title
                title={`${category.name}`}
                subtitleStyle={{ fontSize: 16 }}
                right={(props) => (
                  <IconButton
                    {...props}
                    mode="contained"
                    icon="delete-outline"
                    onPress={() => onDelete(category.id || "")}
                  />
                )}
              />
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
