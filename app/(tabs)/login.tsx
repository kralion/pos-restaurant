import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";

type TLogin = {
  email: string;
  password: string;
};

export default function LogInScreen() {
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TLogin>();

  const onSubmit = async (data: TLogin) => {
    setLoading(true);
    await supabase.auth.signInWithPassword(data);
    setLoading(false);
    reset();
    router.push("/");
  };

  return (
    <ScrollView>
      <SafeAreaView className="flex flex-col justify-center align-middle p-4 items-center h-[100vh]">
        <View className="flex flex-col gap-16 w-full items-center">
          <View className="flex flex-col items-center gap-1">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={{
                uri: "https://img.icons8.com/?size=100&id=2KWR1WgZ9Qoh&format=png&color=000000",
              }}
            />
            <Text className="text-4xl font-bold"> Inicia Sesión</Text>
            <Text className="text-center text-red-300">
              Para empezar a usar y disfrutar de la App
            </Text>
          </View>
          <View className="flex flex-col gap-4 justify-center align-middle w-full">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput onChangeText={onChange} value={value} />
              )}
              rules={{
                required: { value: true, message: "Ingrese el email" },
              }}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput onChangeText={onChange} value={value} />
              )}
              rules={{
                required: { value: true, message: "Ingrese la contraseña" },
              }}
            />
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
