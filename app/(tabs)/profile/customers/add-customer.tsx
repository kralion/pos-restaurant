import { ICustomer } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function AddCustomerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICustomer>({
    defaultValues: {
      full_name: "",
    },
  });

  const onSubmit = async (data: ICustomer) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("fixed_customers").insert(data);
      if (error) alert(error.message);
      router.back();
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
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
