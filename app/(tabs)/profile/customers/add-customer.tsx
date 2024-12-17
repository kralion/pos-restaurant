import { useCustomer } from "@/context/customer";
import { ICustomer } from "@/interfaces";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function AddCustomerScreen() {
  const router = useRouter();
  const { addCustomer, loading } = useCustomer();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICustomer>({
    defaultValues: {
      full_name: "",
      total_free_orders: 0,
      total_orders: 0,
    },
  });

  const onSubmit = async (data: ICustomer) => {
    addCustomer(data);
    reset();
    router.back();
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col justify-center align-middle w-full p-4">
        <Controller
          control={control}
          name="full_name"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Nombres Completos"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.full_name}
              />
              {errors.full_name && (
                <Text className="text-red-500 ml-4">
                  {errors.full_name.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="total_orders"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Total de Ordenes"
                value={String(value)}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.total_orders}
              />
              {errors.total_orders && (
                <Text className="text-red-500 ml-4">
                  {errors.total_orders.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="total_free_orders"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Ordenes Gratis"
                value={String(value)}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.total_free_orders}
              />
              {errors.total_free_orders && (
                <Text className="text-red-500 ml-4">
                  {errors.total_free_orders.message}
                </Text>
              )}
            </View>
          )}
        />

        <Button
          mode="contained"
          style={{ marginTop: 50 }}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >
          Registrar Cliente
        </Button>
      </View>
    </ScrollView>
  );
}
