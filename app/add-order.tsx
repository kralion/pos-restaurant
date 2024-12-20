import { useAuth, useOrderContext } from "@/context";
import { useCategoryContext } from "@/context/category";
import { useCustomer } from "@/context/customer";
import { useMealContext } from "@/context/meals";
import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FlashList } from "@shopify/flash-list";
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
  Switch,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useDebouncedCallback } from "use-debounce";

export default function OrderScreen() {
  const { number, id_table, id_order } = useLocalSearchParams<{
    number: string;
    id_table: string;
    id_order: string;
  }>();
  const {
    categories,
    getCategories,
    loading: categoriesLoading,
  } = useCategoryContext();
  const { getMealsByCategoryId, loading: mealsLoading } = useMealContext();
  const [mealsByCategory, setMealsByCategory] = useState<IMeal[]>([]);
  const [itemsSelected, setItemsSelected] = useState<IMeal[]>([]);
  const [order, setOrder] = useState<IOrder | null>(null);
  const { addOrder, updateOrder, loading: orderLoading } = useOrderContext();
  const { profile } = useAuth();
  const { getCustomers, customers } = useCustomer();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);
  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
  }, 300);

  async function getOrderById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    setOrder(data);
    if (!data) return;
    const order = data as IOrder;
    if (error) {
      console.error("Error getting order:", error);
      alert("Error al obtener o pedido");
    }
    return;
  }

  const handleQuantityChange = (item: IMeal, quantity: number) => {
    const newItemsSelected = [...itemsSelected];
    const index = newItemsSelected.findIndex((i) => i.id === item.id);

    if (quantity > 0) {
      if (index === -1) {
        newItemsSelected.push({ ...item, quantity });
      } else {
        newItemsSelected[index].quantity = quantity;
      }
    } else {
      if (index !== -1) {
        newItemsSelected.splice(index, 1);
      }
    }

    setItemsSelected(newItemsSelected);
  };
  const mealsByCategoryHandler = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    getMealsByCategoryId(category.id as string).then((meals) => {
      setMealsByCategory(meals);
    });
  };

  useEffect(() => {
    getCustomers();
    getCategories();
  }, []);

  useEffect(() => {
    if (id_order) {
      getOrderById(id_order);
    }
  }, [id_order]);
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
      items: [] as IMeal[],
      paid: order?.paid,
      served: order?.served,
      total: order?.total,
    },
  });

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
        total: 100,
      };

      await updateOrder(orderData);
      reset();

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
    }
  };

  const onAdd = async (data: IOrder) => {
    if (!profile.id) return;

    try {
      const orderData: IOrder = {
        ...data,
        served: false,
        id_waiter: profile.id,
        paid: false,
        id_table: id_table,
        items: itemsSelected,
        id_fixed_customer: data.id_fixed_customer
          ? data.id_fixed_customer
          : null,
        total: 100,
      };
      addOrder(orderData);
      reset();
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
    }
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
          position: "absolute",
          top: 40,
          width: "95%",
          minHeight: 400,
          justifyContent: "flex-start",
          margin: 10,
          borderRadius: 16,
        }}
      >
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          className="w-full "
        >
          <View className="flex-row justify-between  items-center mb-4">
            <Text
              style={{ color: "gray", paddingLeft: 10 }}
              variant="bodyLarge"
            >
              Seleccionar Cliente
            </Text>
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
            {filteredCustomers.map((customer) => (
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
            ))}

            {filteredCustomers.length === 0 && (
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
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-zinc-200"
    >
      <View className="flex flex-col w-full items-center p-4 ">
        <Text className="text-2xl mb-4" style={{ fontWeight: "700" }}>
          Mesa #{number}
        </Text>
        <View className="w-full rounded-2xl overflow-hidden flex flex-col bg-white">
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
          {categoriesLoading && <ActivityIndicator style={{ marginTop: 20 }} />}
          {categories.map((category, index) => (
            <List.Section key={category.id}>
              <List.Accordion
                style={{
                  backgroundColor: "white",
                  paddingTop: 0,
                  marginTop: 0,
                }}
                titleStyle={{
                  fontWeight: "500",
                }}
                title={category.name}
                onPress={() => mealsByCategoryHandler(category.id as string)}
              >
                <Divider />
                {mealsLoading && (
                  <ActivityIndicator style={{ marginTop: 20 }} />
                )}
                <FlashList
                  data={mealsByCategory}
                  estimatedItemSize={74}
                  renderItem={({ item }) => (
                    <List.Item
                      style={{
                        paddingRight: 0,
                      }}
                      title={item.name}
                      titleStyle={
                        item.quantity === 0
                          ? {
                              textDecorationLine: "line-through",
                              color: "gray",
                            }
                          : { color: "black" }
                      }
                      description={`S/. ${item.price.toFixed(2)}`}
                      right={(props) => (
                        <View className="flex-row items-center gap-2">
                          <IconButton
                            onPress={() => {
                              const currentItem = itemsSelected.find(
                                (i) => i.id === item.id
                              );
                              const currentQuantity =
                                currentItem?.quantity ?? 0;
                              handleQuantityChange(
                                item,
                                Math.max(currentQuantity - 1, 0)
                              );
                            }}
                            mode="contained"
                            icon="minus"
                            size={18}
                          />
                          <Text variant="titleLarge">
                            {itemsSelected.find((i) => i.id === item.id)
                              ?.quantity ?? 0}
                          </Text>
                          <IconButton
                            onPress={() => {
                              const currentItem = itemsSelected.find(
                                (i) => i.id === item.id
                              );
                              const currentQuantity =
                                currentItem?.quantity ?? 0;
                              handleQuantityChange(item, currentQuantity + 1);
                            }}
                            icon="plus"
                            size={18}
                            mode="contained"
                          />
                        </View>
                      )}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />
                {mealsByCategory.length === 0 && (
                  <View className="p-4 items-center">
                    <Text variant="bodyMedium" style={{ color: "gray" }}>
                      Sin elementos
                    </Text>
                  </View>
                )}
              </List.Accordion>
              {index !== categories.length - 1 && <Divider />}
            </List.Section>
          ))}
        </View>
        <View className="flex flex-col justify-center align-middle w-full gap-4">
          <Button
            mode="contained"
            style={{ marginTop: 50 }}
            onPress={order ? handleSubmit(onUpdate) : handleSubmit(onAdd)}
            loading={orderLoading}
            disabled={isRegisterDisabled}
          >
            {order ? "Editar Orden" : "Registrar Orden"}
          </Button>
          <Button
            mode="outlined"
            style={{ backgroundColor: "white", borderColor: "#f1f1f1" }}
            onPress={() => {
              reset();
              router.back();
            }}
          >
            Cancelar
          </Button>
        </View>
      </View>
      {renderCustomerModal()}
    </ScrollView>
  );
}
