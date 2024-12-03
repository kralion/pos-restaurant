import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { Button, IconButton, List, TextInput } from "react-native-paper";

export default function OrderScreen() {
  const [loading, setLoading] = useState(false);
  const [expandedEntradas, setExpandedEntradas] = useState(false);
  const [expandedFondos, setExpandedFondos] = useState(false);
  const [expandedBebidas, setExpandedBebidas] = useState(false);
  const [entradasData, setEntradasData] = useState<IMeal[]>([]);
  const [fondosData, setFondosData] = useState<IMeal[]>([]);
  const [bebidasData, setBebidasData] = useState<IMeal[]>([]);
  const [selectedEntradas, setSelectedEntradas] = useState<IMeal[]>([]);
  const [selectedFondos, setSelectedFondos] = useState<IMeal[]>([]);
  const [selectedBebidas, setSelectedBebidas] = useState<IMeal[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IOrder>();

  const getEntradasData = async () => {
    const { data: entradas, error } = await supabase
      .from("meals")
      .select("*")
      .eq("category", "entradas");

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
      .eq("category", "fondos");

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
      .eq("category", "bebidas");

    if (error || !bebidas) {
      console.error("An error occurred:", error);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    } else {
      setBebidasData(bebidas);
    }
  };

  useEffect(() => {
    getEntradasData();
    getFondosData();
    getBebidasData();
  }, []);

  const toggleMealSelection = (
    meal: IMeal,
    category: "entradas" | "fondos" | "bebidas"
  ) => {
    let selectedMeals: IMeal[];
    let setSelectedMeals: React.Dispatch<React.SetStateAction<IMeal[]>>;

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

    const isSelected = selectedMeals.some((m) => m.id === meal.id);

    if (isSelected) {
      // Remove meal if already selected
      setSelectedMeals(selectedMeals.filter((m) => m.id !== meal.id));
    } else {
      // Add meal if not selected
      setSelectedMeals([...selectedMeals, meal]);
    }

    // Update form values
    setValue(
      category,
      isSelected
        ? selectedMeals.filter((m) => m.id !== meal.id)
        : [...selectedMeals, meal]
    );
  };

  const onSubmit = async (data: IOrder) => {
    setLoading(true);

    try {
      // Combine selected meals
      const allSelectedMeals = [
        ...selectedEntradas,
        ...selectedFondos,
        ...selectedBebidas,
      ];

      // Calculate total price
      const totalPrice = allSelectedMeals.reduce(
        (sum, meal) => sum + meal.price,
        0
      );

      // Prepare order data
      const orderData: IOrder = {
        ...data,
        served: true,
        id_waiter: "211777bc-f588-4779-b468-6dcde65a960d",
        date: new Date(),
        id: "211777cf-f588-4779-b468-6dcde65a960d",
        paid: false,
        table: Number(data.table),
        entradas: selectedEntradas,
        fondos: selectedFondos,
        bebidas: selectedBebidas,
      };

      const { data: orderResult, error: errors } = await supabase
        .from("orders")
        .insert(orderData);

      if (errors) {
        setLoading(false);
        console.error("An error occurred:", errors);
        return;
      }

      reset();
      // DOCS: Sending data through params
      // router.push("/(waiter)/order/price", {
      //   orderData: JSON.stringify(orderData),
      // });
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView className="flex flex-col justify-center align-middle m-4 items-center">
        <View className="flex flex-col gap-16 w-full items-center">
          <View className="flex flex-col justify-center align-middle w-full">
            {/* Table Number Input */}
            <Controller
              control={control}
              name="table"
              rules={{
                required: "Número de mesa es requerido",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Ingrese un número de mesa válido",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View className="mb-4">
                  <TextInput
                    label="Número de Mesa"
                    value={String(value)}
                    onChangeText={onChange}
                    mode="outlined"
                    keyboardType="numeric"
                    error={!!errors.table}
                  />
                  {errors.table && (
                    <Text className="text-red-500 ml-4">
                      {errors.table.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <List.Section title="Entradas">
              <List.Accordion
                title="Seleccionar Entradas"
                expanded={expandedEntradas}
                onPress={() => setExpandedEntradas(!expandedEntradas)}
              >
                {entradasData.map((item) => (
                  <List.Item
                    title={item.name}
                    onPress={() => toggleMealSelection(item, "entradas")}
                    right={() => (
                      <View className="flex-row items-center">
                        <Text className="text-sm mr-2">
                          S/. {item.price.toString()}.00
                        </Text>
                        <IconButton
                          icon="check"
                          size={15}
                          mode={
                            selectedEntradas.some((m) => m.id === item.id)
                              ? "contained"
                              : "outlined"
                          }
                        />
                      </View>
                    )}
                    key={item.id}
                  />
                ))}
              </List.Accordion>
            </List.Section>
            <List.Section title="Fondos">
              <List.Accordion
                title="Seleccionar Fondos"
                expanded={expandedFondos}
                onPress={() => setExpandedFondos(!expandedFondos)}
              >
                {fondosData.map((item) => (
                  <List.Item
                    title={item.name}
                    onPress={() => toggleMealSelection(item, "fondos")}
                    right={() => (
                      <View className="flex-row items-center">
                        <Text className="text-sm mr-2">
                          S/. {item.price.toString()}.00
                        </Text>
                        <IconButton
                          icon="check"
                          size={15}
                          mode={
                            selectedFondos.some((m) => m.id === item.id)
                              ? "contained"
                              : "outlined"
                          }
                        />
                      </View>
                    )}
                    key={item.id}
                  />
                ))}
              </List.Accordion>
            </List.Section>
            <List.Section title="Bebidas">
              <List.Accordion
                title="Seleccionar Bebidas"
                expanded={expandedBebidas}
                onPress={() => setExpandedBebidas(!expandedBebidas)}
              >
                {bebidasData.map((item) => (
                  <List.Item
                    title={item.name}
                    onPress={() => toggleMealSelection(item, "bebidas")}
                    right={() => (
                      <View className="flex-row items-center">
                        <Text className="text-sm mr-2">
                          S/. {item.price.toString()}.00
                        </Text>
                        <IconButton
                          icon="check"
                          size={15}
                          mode={
                            selectedBebidas.some((m) => m.id === item.id)
                              ? "contained"
                              : "outlined"
                          }
                        />
                      </View>
                    )}
                    key={item.id}
                  />
                ))}
              </List.Accordion>
            </List.Section>

            <Button
              mode="contained"
              style={{ marginTop: 50 }}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            >
              Continuar
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
