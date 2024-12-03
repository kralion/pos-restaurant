import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type TLogin = {
  username: string;
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
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", data.username)
        .eq("password", data.password)
        // TODO: Store passwords securely, e.g., hashing.
        .single();

      if (error || !user) {
        console.error("Invalid credentials");
        alert("Credenciales inválidas");
        setLoading(false);
        return;
      }

      reset();
      router.push("/");
    } catch (err) {
      console.error("An error occurred:", err);
      alert("Algo sucedió mal, vuelve a intentarlo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView className="flex flex-col justify-center align-middle m-4 items-center ">
        <View className="flex flex-col gap-16 w-full items-center">
          <View className="flex flex-col items-center gap-8 mt-20">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../assets/images/logo.png")}
            />
            <View className="flex flex-col gap-1 items-center">
              <Text className="text-4xl font-bold"> Inicia Sesión</Text>
              <Text className="text-center ">
                Recuerda que la credenciales son precreadas
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-4 justify-center align-middle w-full">
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Usuario"
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              rules={{
                required: { value: true, message: "Ingrese el usuario" },
              }}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Contraseña"
                  mode="outlined"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  right={<TextInput.Icon icon="lock" />}
                />
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
