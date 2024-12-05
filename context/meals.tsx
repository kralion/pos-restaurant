import { IMeal, IMealContextProvider } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import * as React from "react";
import { createContext, useContext } from "react";

export const MealContext = createContext<IMealContextProvider>({
  addMeal: async () => {},
  getMealById: async (id: string): Promise<IMeal> => ({} as IMeal),
  meals: [],
  meal: {} as IMeal,
  deleteMeal: async () => {},
  getDailyMeals: async () => [] as IMeal[],
  changeMealAvailability: async () => {},
});

export const MealContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [meals, setDailyMeals] = React.useState<IMeal[]>([]);
  const [meal, setMeal] = React.useState<IMeal>({} as IMeal);

  const addMeal = async (Meal: IMeal) => {
    await supabase.from("meals").insert(Meal);
  };

  const getDailyMeals = async () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      // TODO: Fix this
      // .gte("created_at", startOfDay) // Greater than or equal to start of day
      // .lte("created_at", endOfDay) // Less than or equal to end of day
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) {
      console.error("Error fetching daily meals:", error);
      return null;
    }
    setDailyMeals(data);
    return data;
  };

  const changeMealAvailability = async (id: string, quantity: number) => {
    await supabase.from("meals").update({ quantity }).eq("id", id);
  };

  const deleteMeal = async (id: string) => {
    await supabase.from("meals").delete().eq("id", id);
  };

  async function getMealById(id: string) {
    const { data, error } = await supabase
      .from("meals")
      .select("*, users:id_waiter(name)")
      .eq("id", id)
      .single();
    if (error) throw error;
    setMeal(data);
    return data;
  }
  return (
    <MealContext.Provider
      value={{
        meals,
        deleteMeal,
        getMealById,
        changeMealAvailability,
        getDailyMeals,
        addMeal,
        meal,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useMealContext = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMealContext must be used within a MealProvider");
  }
  return context;
};
