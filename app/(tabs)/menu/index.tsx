import MealCard from "@/components/meal-card";
import { useMealContext } from "@/context/meals";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuScreen() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { meals, getDailyMeals } = useMealContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setIsLoading(true);
    try {
      await getDailyMeals();
    } catch (error) {
      console.error("Error refreshing meals:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  }, [getDailyMeals]);
  React.useEffect(() => {
    getDailyMeals();
    const channel = supabase.channel("meals-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "meals",
      },
      () => {
        getDailyMeals();
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const filteredMeals = React.useMemo(() => {
    if (!search) return meals;
    const lowercasedSearch = search.toLowerCase();
    return meals.filter(
      (meals) =>
        meals.name.toString().includes(lowercasedSearch) ||
        meals.category.toString().includes(lowercasedSearch)
    );
  }, [search, meals]);

  if (!meals) return <ActivityIndicator />;
  if (isLoading && !meals?.length) return <ActivityIndicator />;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlashList
        contentContainerStyle={{
          
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: meal }) => <MealCard meal={meal} />}
        data={filteredMeals}
        estimatedItemSize={200}
        horizontal={false}
      />
    </SafeAreaView>
  );
}
