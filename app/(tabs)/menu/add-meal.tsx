import { IMeal } from "@/interfaces";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, Text, View } from "react-native";
import { Button, List, TextInput } from "react-native-paper";
import { supabase } from "@/utils/supabase";

export default function MenuScreen() {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const headerHeight = useHeaderHeight();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IMeal>({
    defaultValues: {
      name: "",
      price: 0,
      category: "entradas",
      quantity: 0,
    },
  });
  const onSubmit = async (data: IMeal) => {
    setLoading(true);
    try {
      await supabase.from("meals").insert(data);
      alert("Item agregado");
      reset();
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ marginTop: headerHeight }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex flex-col gap-10 w-full items-center p-4">
        <Image
          source={{
            uri: "https://img.icons8.com/?size=100&id=8439&format=png&color=FD7E14",
          }}
          style={{ width: 100, height: 100 }}
        />
        <View className="flex flex-col justify-center align-middle w-full">
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
                  <Text className="text-red-500 ml-4">
                    {errors.name.message}
                  </Text>
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
            name="category"
            rules={{
              required: "Campo requerido",
            }}
            render={({ field: { onChange, value } }) => (
              <View className="mb-4">
                <List.Section>
                  <List.Accordion
                    expanded={expanded}
                    title={value}
                    onPress={() => setExpanded(!expanded)}
                  >
                    <List.Item
                      title="Entradas"
                      onPress={() => {
                        onChange("Entradas");
                        setExpanded(!expanded);
                      }}
                    />
                    <List.Item
                      title="Fondos"
                      onPress={() => {
                        onChange("Fondos");
                        setExpanded(!expanded);
                      }}
                    />
                    <List.Item
                      title="Bebidas"
                      onPress={() => {
                        onChange("Bebidas");
                        setExpanded(!expanded);
                      }}
                    />
                  </List.Accordion>
                </List.Section>
                {errors.category && (
                  <Text className="text-red-500 ml-4">
                    {errors.category.message}
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
      </View>
    </ScrollView>
  );
}
