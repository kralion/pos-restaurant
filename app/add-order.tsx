import { useAuth, useOrderContext } from "@/context";
import { useCustomer } from "@/context/customer";
import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  List,
  Modal,
  Portal,
  Searchbar,
  Surface,
  Switch,
  Text,
} from "react-native-paper";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useDebouncedCallback } from "use-debounce";

interface MealWithQuantity extends IMeal {
  quantity: number;
}

export default function OrderScreen() {
  const { number, id_table } = useLocalSearchParams<{
    number: string;
    id_table: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [expandedEntradas, setExpandedEntradas] = useState(false);
  const [expandedFondos, setExpandedFondos] = useState(false);
  const [expandedBebidas, setExpandedBebidas] = useState(false);
  const [entradasData, setEntradasData] = useState<IMeal[]>([]);
  const [fondosData, setFondosData] = useState<IMeal[]>([]);
  const [bebidasData, setBebidasData] = useState<IMeal[]>([]);
  const { addOrder, updateOrder } = useOrderContext();
  const [selectedEntradas, setSelectedEntradas] = useState<MealWithQuantity[]>(
    order?.entradas ? order.entradas : []
  );
  const [selectedFondos, setSelectedFondos] = useState<MealWithQuantity[]>(
    order?.fondos ? order.fondos : []
  );
  const [selectedBebidas, setSelectedBebidas] = useState<MealWithQuantity[]>(
    order?.bebidas ? order.bebidas : []
  );
  const { profile } = useAuth();
  const { getCustomers, customers } = useCustomer();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);
  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
  }, 300);

  async function getCurrentOrderById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error getting order:", error);
      alert("Error al obtener o pedido");
      return;
    }
    setOrder(data);
  }

  useEffect(() => {
    getCustomers();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IOrder>({
    defaultValues: {
      id_table: order?.id_table,
      id_fixed_customer: order?.id_fixed_customer
        ? order?.id_fixed_customer
        : "",
      entradas: order?.entradas,
      fondos: order?.fondos,
      bebidas: order?.bebidas,
      paid: order?.paid,
      served: order?.served,
      total: order?.total,
    },
  });

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

  useEffect(() => {
    if (!order) return;
    getCurrentOrderById(order.id ? order.id : "");
  }, [order]);
  useEffect(() => {
    const selectedCustomer = customers.find(
      (c) => c.id === watch("id_fixed_customer")
    );
    const isFreeOrderSelected = watch("free");
    if (
      selectedCustomer &&
      selectedCustomer.total_free_orders === 0 &&
      isFreeOrderSelected
    ) {
      setIsRegisterDisabled(true);
    } else {
      setIsRegisterDisabled(false);
    }
  }, [watch("id_fixed_customer"), watch("free")]);

  const onUpdate = async (data: IOrder) => {
    setLoading(true);
    try {
      const orderData: IOrder = {
        ...data,
        served: order?.served || data.served,
        to_go: order?.to_go || data.to_go,
        id: order?.id || data.id,
        id_waiter: order?.id_waiter || data.id_waiter,
        paid: order?.paid || data.paid,
        id_fixed_customer:
          order?.id_fixed_customer || data.id_fixed_customer || null,
        id_table: id_table,
        entradas: selectedEntradas,
        fondos: selectedFondos,
        bebidas: selectedBebidas,
        total: selectedEntradas
          .concat(selectedFondos)
          .concat(selectedBebidas)
          .reduce((acc, meal) => acc + meal.price * meal.quantity, 0),
      };

      await updateOrder(orderData);
      reset();
      setSelectedEntradas([]);
      setSelectedFondos([]);
      setSelectedBebidas([]);

      if (data.free) {
        const selectedCustomer = customers.find(
          (c) => c.id === data.id_fixed_customer
        );
        if (selectedCustomer) {
          await supabase
            .from("fixed_customers")
            .update({
              total_free_orders: selectedCustomer.total_free_orders - 1,
            })
            .eq("id", selectedCustomer.id);
        }
      }
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async (data: IOrder) => {
    setLoading(true);
    if (!profile.id) return;

    try {
      const orderData: IOrder = {
        ...data,
        served: false,
        id_waiter: profile.id,
        paid: false,
        id_table: id_table,
        id_fixed_customer: data.id_fixed_customer
          ? data.id_fixed_customer
          : null,
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

      if (data.free) {
        const selectedCustomer = customers.find(
          (c) => c.id === data.id_fixed_customer
        );
        console.log("selectedCustomer", selectedCustomer);
        if (selectedCustomer) {
          await supabase
            .from("fixed_customers")
            .update({
              total_free_orders: selectedCustomer.total_free_orders - 1,
            })
            .eq("id", selectedCustomer.id);
        }
      }
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

  const filteredCustomers = React.useMemo(
    () =>
      customers.filter((customer) =>
        customer.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [customers, searchQuery]
  );

  const renderCustomerModal = () => (
    <Portal>
      <Modal
        visible={showCustomerModal}
        onDismiss={() => {
          setShowCustomerModal(false);
          setSearchText("");
          setSearchQuery("");
        }}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 16,
          margin: 16,
          borderRadius: 8,
        }}
      >
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          className="w-full"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="titleSmall">Seleccionar Cliente</Text>
            <IconButton
              icon="close"
              onPress={() => {
                setShowCustomerModal(false);
                setSearchText("");
                setSearchQuery("");
              }}
            />
          </View>
          <Searchbar
            placeholder="Buscar cliente..."
            onChangeText={(text) => {
              setSearchText(text);
              debouncedSearch(text);
            }}
            value={searchText}
            onClearIconPress={() => {
              setSearchText("");
              setSearchQuery("");
            }}
            autoFocus
          />

          <ScrollView style={{ maxHeight: 400 }}>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <List.Item
                  key={customer.id}
                  title={customer.full_name}
                  onPress={() => {
                    setValue("id_fixed_customer", customer.id);
                    setShowCustomerModal(false);
                    setSearchText("");
                    setSearchQuery("");
                  }}
                  left={(props) => <List.Icon {...props} icon="account" />}
                  right={(props) =>
                    watch("id_fixed_customer") === customer.id ? (
                      <List.Icon {...props} icon="check" />
                    ) : null
                  }
                />
              ))
            ) : (
              <View className="p-4 items-center">
                <Text variant="bodyMedium">No se encontraron clientes</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Modal>
    </Portal>
  );

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-4 w-full items-center p-4">
        <View className="w-full flex flex-col items-center ">
          <Text className="text-xl" style={{ fontWeight: "700" }}>
            Orden Mesa #{number}
          </Text>
          <Divider />
        </View>
        <View className="w-full rounded-lg overflow-hidden flex flex-col borde bg-white">
          <Controller
            control={control}
            name="id_fixed_customer"
            render={({ field: { value } }) => (
              <View className="flex flex-row gap-2 justify-between items-center p-4 w-full">
                <View>
                  <Text variant="titleMedium">Cliente Fijo</Text>
                  {value && (
                    <Text variant="bodyMedium" className="opacity-60">
                      {(() => {
                        const customer = customers.find((c) => c.id === value);
                        return (
                          <>
                            {customer?.full_name} -{" "}
                            {customer?.total_free_orders} pedidos gratis
                          </>
                        );
                      })()}
                    </Text>
                  )}
                </View>
                <Switch
                  value={!!value}
                  onValueChange={(checked) => {
                    if (checked) {
                      setShowCustomerModal(true);
                    } else {
                      setValue("id_fixed_customer", undefined);
                      setValue("free", false);
                    }
                  }}
                />
              </View>
            )}
          />
          <Divider />

          {/* Show free order switch only when fixed customer has available free orders */}
          {(() => {
            const selectedCustomer = customers.find(
              (c) => c.id === watch("id_fixed_customer")
            );
            return (selectedCustomer?.total_free_orders ?? 0) > 0 ? (
              <>
                <Controller
                  control={control}
                  name="free"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex flex-row gap-2 justify-between items-center p-4">
                      <View>
                        <Text variant="titleMedium">Orden Gratuita</Text>
                      </View>
                      <Switch value={value} onValueChange={onChange} />
                    </View>
                  )}
                />
                <Divider />
              </>
            ) : null;
          })()}

          <Controller
            control={control}
            name="to_go"
            render={({ field: { onChange, value } }) => (
              <View className="flex flex-row gap-2 justify-between items-center p-4">
                <View>
                  <Text variant="titleMedium">Orden para llevar</Text>
                </View>
                <Switch value={value} onValueChange={onChange} />
              </View>
            )}
          />
          <Divider />
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
          <Divider />
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
          <Divider />
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
        </View>
        <View className="flex flex-col justify-center align-middle w-full gap-4">
          <Button
            mode="contained"
            style={{ marginTop: 50 }}
            onPress={order ? handleSubmit(onUpdate) : handleSubmit(onAdd)}
            loading={loading}
            disabled={isRegisterDisabled}
          >
            {order ? "Editar Orden" : "Registrar Orden"}
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
      {renderCustomerModal()}
    </ScrollView>
  );
}
