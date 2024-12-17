import { useAuth } from "@/context";
import { useCategoryContext } from "@/context/category";
import { ICategory } from "@/interfaces";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function AddCategoryScreen() {
  const [loading, setLoading] = useState(false);
  const { addCategory } = useCategoryContext();
  const { profile } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICategory>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ICategory) => {
    setLoading(true);
    addCategory({
      ...data,
      id_tenant: profile.id_tenant,
    });
    reset();
    router.back();
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col justify-center align-middle w-full p-4">
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Nombre de la Categoría"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.name}
              />
              {errors.name && (
                <Text className="text-red-500 ml-4">{errors.name.message}</Text>
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
          Registrar Categoría
        </Button>
      </View>
    </ScrollView>
  );
}
