import { IOrder, IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { Info } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export default function OrderScreen() {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IOrder>();

  const onSubmit = async (data: IOrder) => {
    setLoading(true);
    try {
      const { data: user, error } = await supabase
        .from("orders")
        .insert(data)

      if (error || !user) {
        setVisible(true);
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
          
          <View className="flex flex-col gap-6 justify-center align-middle w-full">
            <Controller
              control={control}
              name=""
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Usuario"
                    error={errors.username ? true : false}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.username && (
                    <View className="flex flex-row gap-1">
                      <Info color="red" size={20} />
                      <Text className="text-red-500">
                        {errors.username.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              rules={{
                required: { value: true, message: "Ingrese el usuario" },
              }}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2">
                  <TextInput
                    label="Contraseña"
                    secureTextEntry
                    error={errors.password ? true : false}
                    onChangeText={onChange}
                    value={value}
                    right={<TextInput.Icon icon="lock" />}
                  />
                  {errors.password && (
                    <View className="flex flex-row gap-1">
                      <Info color="red" size={20} />
                      <Text className="text-red-500">
                        {errors.password.message}
                      </Text>
                    </View>
                  )}
                </View>
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
          <View className="mt-20 flex flex-col gap-2">
            <Text className="text-muted-foreground text-zinc-400   mx-auto">
              Desarrollado por
              <Text
                className="font-bold text-purple-800"
                onPress={() => Linking.openURL("https://grobles.netlify.app")}
              >
                {" "}
                Grobles
              </Text>
            </Text>
            <Text className="text-muted-foreground text-zinc-400   mx-auto text-sm">
              Versión 0.0.12
            </Text>
          </View>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <View className="w-full flex flex-row justify-center items-center">
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=xNgsHu6eqArG&format=png&color=000000",
                }}
                style={{ width: 50, height: 50 }}
              />
            </View>

            <Dialog.Title>Credenciales Incorrectas</Dialog.Title>
            <Dialog.Content>
              <Text>
                Recuerda que la credenciales son precreadas, solicitalas en el
                area correspondiente
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="red" onPress={() => setVisible(false)}>
                Cerrar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </ScrollView>
  );
}
