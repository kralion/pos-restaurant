import { useAuth, useOrderContext } from "@/context";
import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  List,
  Surface,
  Switch,
  Text,
} from "react-native-paper";

interface MealWithQuantity extends IMeal {
  quantity: number;
}

export default function OrderScreen() {
  const { number, id_table } = useLocalSearchParams<{
    number: string;
    id_table: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [expandedEntradas, setExpandedEntradas] = useState(false);
  const [expandedFondos, setExpandedFondos] = useState(false);
  const [expandedBebidas, setExpandedBebidas] = useState(false);
  const [entradasData, setEntradasData] = useState<IMeal[]>([]);
  const [fondosData, setFondosData] = useState<IMeal[]>([]);
  const [bebidasData, setBebidasData] = useState<IMeal[]>([]);
  const [selectedEntradas, setSelectedEntradas] = useState<MealWithQuantity[]>(
    []
  );
  const [selectedFondos, setSelectedFondos] = useState<MealWithQuantity[]>([]);
  const [selectedBebidas, setSelectedBebidas] = useState<MealWithQuantity[]>(
    []
  );
  const headerHeight = useHeaderHeight();
  const { session } = useAuth();
  const { addOrder } = useOrderContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IOrder>();

  const updateMealQuantity = (
    meal: IMeal,
    quantity: number,
    category: "entradas" | "fondos" | "bebidas"
  ) => {
    let selectedMeals: MealWithQuantity[];
    let setSelectedMeals: React.Dispatch<
      React.SetStateAction<MealWithQuantity[]>
    >;

    switch (category) {
      case "entradas":
        selectedMeals = selectedEntradas;
        setSelectedMeals = setSelectedEntradas;
        break;
      case "fondos":
        selectedMeals = selectedFondos;
        setSelectedMeals = setSelectedFondos;
        break;
      case "bebidas":
        selectedMeals = selectedBebidas;
        setSelectedMeals = setSelectedBebidas;
        break;
    }

    const existingMealIndex = selectedMeals.findIndex((m) => m.id === meal.id);

    if (existingMealIndex !== -1) {
      const updatedMeals = [...selectedMeals];
      if (quantity > 0) {
        updatedMeals[existingMealIndex].quantity = quantity;
        setSelectedMeals(updatedMeals);
      } else {
        // Remove meal if quantity is 0
        setSelectedMeals(selectedMeals.filter((m) => m.id !== meal.id));
      }
    } else if (quantity > 0) {
      // Add meal with specified quantity
      const newMealWithQuantity = { ...meal, quantity };
      setSelectedMeals([...selectedMeals, newMealWithQuantity]);
    }

    // Update form values
    setValue(
      category,
      category === "entradas"
        ? selectedEntradas
        : category === "fondos"
        ? selectedFondos
        : selectedBebidas
    );
  };

  useEffect(() => {
    // Initial data fetch
    const getEntradasData = async () => {
      const { data: entradas, error } = await supabase
        .from("meals")
        .select("*")
        .eq("category", "Entradas");
      if (error || !entradas) {
        console.error("An error occurred:", error);
        alert("Algo sucedió mal, vuelve a intentarlo.");
      } else {
        setEntradasData(entradas);
      }
    };

    const getFondosData = async () => {
      const { data: fondos, error } = await supabase
        .from("meals")
        .select("*")
        .eq("category", "Fondos");
      if (error || !fondos) {
        console.error("An error occurred:", error);
        alert("Algo sucedió mal, vuelve a intentarlo.");
      } else {
        setFondosData(fondos);
      }
    };

    const getBebidasData = async () => {
      const { data: bebidas, error } = await supabase
        .from("meals")
        .select("*")
        .eq("category", "Bebidas");
      if (error || !bebidas) {
        console.error("An error occurred:", error);
        alert("Algo sucedió mal, vuelve a intentarlo.");
      } else {
        setBebidasData(bebidas);
      }
    };

    // Real-time subscriptions for selecting data
    const entradasChannel = supabase
      .channel("entradas-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meals",
          filter: "category=eq.entradas",
        },
        async (payload) => {
          const { data: updatedEntradas, error } = await supabase
            .from("meals")
            .select("*")
            .eq("category", "Entradas");

          if (error) {
            console.error("Error fetching updated entradas:", error);
          } else {
            setEntradasData(updatedEntradas);
          }
        }
      )
      .subscribe();

    const fondosChannel = supabase
      .channel("fondos-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meals",
          filter: "category=eq.fondos",
        },
        async (payload) => {
          const { data: updatedFondos, error } = await supabase
            .from("meals")
            .select("*")
            .eq("category", "Fondos");

          if (error) {
            console.error("Error fetching updated fondos:", error);
          } else {
            setFondosData(updatedFondos);
          }
        }
      )
      .subscribe();

    const bebidasChannel = supabase
      .channel("bebidas-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meals",
          filter: "category=eq.bebidas",
        },
        async (payload) => {
          const { data: updatedBebidas, error } = await supabase
            .from("meals")
            .select("*")
            .eq("category", "Bebidas");

          if (error) {
            console.error("Error fetching updated bebidas:", error);
          } else {
            setBebidasData(updatedBebidas);
          }
        }
      )
      .subscribe();

    // Initial data fetch
    getEntradasData();
    getFondosData();
    getBebidasData();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(entradasChannel);
      supabase.removeChannel(fondosChannel);
      supabase.removeChannel(bebidasChannel);
    };
  }, []); // Empty dependency array means this runs once on component mount

  const onSubmit = async (data: IOrder) => {
    setLoading(true);

    try {
      const orderData: IOrder = {
        ...data,
        served: false,
        id_waiter: session.user.id,
        paid: false,
        id_table: id_table,
        entradas: selectedEntradas,
        fondos: selectedFondos,
        bebidas: selectedBebidas,
        total: selectedEntradas
          .concat(selectedFondos)
          .concat(selectedBebidas)
          .reduce((acc, meal) => acc + meal.price * meal.quantity, 0),
      };

      addOrder(orderData, id_table);
      reset();
      setSelectedEntradas([]);
      setSelectedFondos([]);
      setSelectedBebidas([]);
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    } finally {
      setLoading(false);
    }
  };

  const renderMealItem = (
    item: IMeal,
    category: "entradas" | "fondos" | "bebidas",
    selectedMeals: MealWithQuantity[]
  ) => {
    const selectedMeal = selectedMeals.find((m) => m.id === item.id);
    const currentQuantity = selectedMeal ? selectedMeal.quantity : 0;

    return (
      <Surface
        key={item.id}
        className="flex-row items-center justify-between p-2  border-b border-gray-200 rounded-t-lg"
      >
        <View className="flex-1 ">
          <Text variant="titleMedium">{item.name}</Text>
          <Text variant="labelSmall" className="opacity-50">
            S/. {item.price.toString()}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <IconButton
            icon="minus"
            disabled={currentQuantity <= 0}
            onPress={() =>
              updateMealQuantity(
                item,
                Math.max(0, currentQuantity - 1),
                category
              )
            }
          />

          <Text variant="bodyMedium">{currentQuantity}</Text>

          <IconButton
            icon="plus"
            onPress={() =>
              updateMealQuantity(item, currentQuantity + 1, category)
            }
          />
        </View>
      </Surface>
    );
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-16 w-full items-center p-4">
        <View className="w-full flex flex-col items-center ">
          <Text className="text-xl" style={{ fontWeight: "700" }}>
            Orden Mesa #{number}
          </Text>
          <Divider />
        </View>
        <View className="flex flex-col justify-center align-middle w-full gap-4">
          <Controller
            control={control}
            name="to_go"
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-row gap-2 justify-between items-center bg-white h-20 p-4">
                <Text variant="bodyLarge">Orden para llevar ?</Text>
                <Switch value={value} onValueChange={onChange} />
              </View>
            )}
          />
          <List.Section>
            <List.Accordion
              title="Seleccionar Entradas"
              expanded={expandedEntradas}
              onPress={() => setExpandedEntradas(!expandedEntradas)}
            >
              {entradasData.map((item) =>
                renderMealItem(item, "entradas", selectedEntradas)
              )}
            </List.Accordion>
          </List.Section>

          <List.Section>
            <List.Accordion
              title="Seleccionar Fondos"
              expanded={expandedFondos}
              onPress={() => setExpandedFondos(!expandedFondos)}
            >
              {fondosData.map((item) =>
                renderMealItem(item, "fondos", selectedFondos)
              )}
            </List.Accordion>
          </List.Section>

          <List.Section>
            <List.Accordion
              title="Seleccionar Bebidas"
              expanded={expandedBebidas}
              onPress={() => setExpandedBebidas(!expandedBebidas)}
            >
              {bebidasData.map((item) =>
                renderMealItem(item, "bebidas", selectedBebidas)
              )}
            </List.Accordion>
          </List.Section>

          <Button
            mode="contained"
            style={{ marginTop: 50 }}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          >
            Registrar Orden
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              reset();
              router.back();
            }}
            loading={loading}
          >
            Cancelar
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
