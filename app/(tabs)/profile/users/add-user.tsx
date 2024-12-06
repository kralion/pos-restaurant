import { IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Button, List, TextInput } from "react-native-paper";

export default function AddUserScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const headerHeight = useHeaderHeight();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    defaultValues: {
      name: "",
      last_name: "",
      image_url: "",
      email: "",
      password: "",
      role: "waiter",
    },
  });

  const onSubmit = async (data: IUser) => {
    setLoading(true);
    try {

      // Obtener la sesión actual del administrador
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Debes estar autenticado como administrador para crear usuarios");
      }
      
      // Crear usuario sin iniciar sesión
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            last_name: data.last_name,
            role: data.role,
          }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          alert("Este correo electrónico ya está registrado");
          return;
        }
        throw authError;
      }

      if (!authData.user?.id) {
        throw new Error("No se pudo crear el usuario");
      }

      // Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        name: data.name,
        last_name: data.last_name,
        role: data.role,
        image_url: data.image_url || null,
      });

      if (profileError) throw profileError;

      // Cerrar inmediatamente la sesión del usuario creado
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;

      // Restaurar la sesión del administrador
      const { error: sessionError } = await supabase.auth.setSession(session);
      
      if (sessionError) throw sessionError;

      alert("Usuario agregado exitosamente");
      reset();
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
          name="image_url"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="URL de foto de perfil (opcional)"
                value={value}
                onChangeText={onChange}
                mode="outlined"
              />
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
                label="Nombres"
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
          name="last_name"
          rules={{
            required: "Requerido",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Apellidos"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.last_name}
              />
              {errors.last_name && (
                <Text className="text-red-500 ml-4">
                  {errors.last_name.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Ingrese un correo valido",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Correo"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={!!errors.email}
              />
              {errors.email && (
                <Text className="text-red-500 ml-4">
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Requerido",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <TextInput
                label="Contraseña"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                secureTextEntry
                error={!!errors.password}
              />
              {errors.password && (
                <Text className="text-red-500 ml-4">
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="role"
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
                    title="Mesero"
                    onPress={() => {
                      onChange("waiter");
                      setExpanded(!expanded);
                    }}
                  />
                  <List.Item
                    title="Cocinero"
                    onPress={() => {
                      onChange("chef");
                      setExpanded(!expanded);
                    }}
                  />
                  <List.Item
                    title="Administrador"
                    onPress={() => {
                      onChange("admin");
                      setExpanded(!expanded);
                    }}
                  />
                </List.Accordion>
              </List.Section>
              {errors.role && (
                <Text className="text-red-500 ml-4">{errors.role.message}</Text>
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
          Registrar
        </Button>
      </View>
    </ScrollView>
  );
}
