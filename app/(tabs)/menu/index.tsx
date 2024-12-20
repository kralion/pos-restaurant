import MealCard from "@/components/meal-card";
import { useCategoryContext } from "@/context/category";
import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Divider,
  Menu,
  Text,
} from "react-native-paper";
const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";
export default function MenuScreen() {
  const { getMealsByCategoryId, loading } = useMealContext();
  const [mealsByCategoryId, setMealsByCategoryId] = React.useState<
    IMeal[] | undefined
  >();
  const { categories, getCategories } = useCategoryContext();
  const [categoryId, setCategoryId] = React.useState<string | undefined>("2");
  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    getCategories();
  }, []);
  // const onRefresh = React.useCallback(async () => {
  //   setRefreshing(true);
  //   setIsLoading(true);
  //   try {
  //     await getDailyMeals();
  //   } catch (error) {
  //     console.error("Error refreshing meals:", error);
  //   } finally {
  //     setRefreshing(false);
  //     setIsLoading(false);
  //   }
  // }, [getDailyMeals]);

  React.useEffect(() => {
    getMealsByCategoryId(categoryId as string).then((meals) => {
      setMealsByCategoryId(meals);
    });
  }, [categoryId]);

  return (
    <>
      <Appbar.Header
        style={{
          borderBottomColor: "#f1f1f1",
          borderBottomWidth: 0.5,
        }}
      >
        <Appbar.Content title="Menú del Día" />
        <Menu
          visible={visible}
          style={{
            paddingTop: 50,
            paddingRight: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onDismiss={() => setVisible(false)}
          anchor={
            <Appbar.Action icon={MORE_ICON} onPress={() => setVisible(true)} />
          }
        >
          <Menu.Item
            onPress={() => {
              router.push("/menu/add-meal");
              setVisible(false);
            }}
            leadingIcon="plus"
            title="Agregar nuevo item"
          />
          <Divider />

          <Text
            style={{
              color: "gray",
            }}
            className="m-2"
          >
            Categorías
          </Text>
          <Divider />
          {categories.map((category) => (
            <Menu.Item
              key={category.id}
              trailingIcon={category.id === categoryId ? "check" : undefined}
              onPress={() => {
                setCategoryId(category.id);
                setVisible(false);
              }}
              title={category.name}
            />
          ))}
        </Menu>
      </Appbar.Header>
      <View className="flex-1">
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          className=" bg-white flex-1 h-screen-safe"
        >
          {loading && <ActivityIndicator className="mt-20" />}
          <FlashList
            contentContainerStyle={{}}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
            renderItem={({ item: meal }) => <MealCard meal={meal} />}
            data={mealsByCategoryId}
            estimatedItemSize={200}
            horizontal={false}
          />
          {mealsByCategoryId?.length === 0 && (
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
      </View>
    </>
  );
}
