import { useCategoryContext } from "@/context/category";
import { useMealContext } from "@/context/meals";
import { IMeal } from "@/interfaces";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Button, List, TextInput } from "react-native-paper";

export default function MenuScreen() {
  const { addMeal, loading } = useMealContext();
  const { categories } = useCategoryContext();
  const [expanded, setExpanded] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IMeal>({
    defaultValues: {
      name: "",
      price: 0,
      id_category: "Seleccionar Categoría",
      quantity: 0,
      image_url: "",
    },
  });
  const onSubmit = async (data: IMeal) => {
    const { id_category } = data;
    const category = categories.find(
      (category) => category.name === id_category
    );
    if (category) {
      addMeal({
        ...data,
        id_category: category?.id ?? "1",
      });
      reset();
    }
  };

  return (
    <ScrollView
      style={{ marginTop: headerHeight }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex flex-col justify-center align-middle w-full p-4">
        <Controller
          control={control}
          name="image_url"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="URL de la imagen del item"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.name}
              />
              {errors.image_url && (
                <Text className="text-red-500 ml-4">
                  {errors.image_url.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Descripción"
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
        <Controller
          control={control}
          name="price"
          rules={{
            required: "Requerido",
            pattern: {
              value: /^[0-9]+$/,
              message: "Ingrese un valor válido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Precio Unitario"
                value={String(value)}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.name}
              />
              {errors.quantity && (
                <Text className="text-red-500 ml-4">
                  {errors.quantity.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="quantity"
          rules={{
            required: "Requerido",
            pattern: {
              value: /^[0-9]+$/,
              message: "Ingrese un valor válido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Cantidad"
                value={String(value)}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="numeric"
                error={!!errors.quantity}
              />
              {errors.quantity && (
                <Text className="text-red-500 ml-4">
                  {errors.quantity.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="id_category"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <List.Section>
                <List.Accordion
                  expanded={expanded}
                  title={value}
                  onPress={() => setExpanded(!expanded)}
                >
                  {categories.map((category) => (
                    <List.Item
                      key={category.id}
                      title={category.name}
                      onPress={() => {
                        onChange(category.name);
                        setExpanded(!expanded);
                      }}
                    />
                  ))}
                </List.Accordion>
              </List.Section>
              {errors.id_category && (
                <Text className="text-red-500 ml-4">
                  {errors.id_category.message}
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
          Registrar Item
        </Button>
      </View>
    </ScrollView>
  );
}
