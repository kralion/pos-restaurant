import { View, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FAB,
  Button,
  Card,
  Text,
} from "react-native-paper";
import { supabase } from "@/utils/supabase";
import { IUser } from "@/interfaces";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useHeaderHeight } from "@react-navigation/elements";
import { useAuth } from "@/context/auth";

export default function UsersScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, getUsers, deleteUser, users } = useAuth();
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    getUsers()
      .then(() => setLoading(false))
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    // Suscripción a cambios en la tabla users
    const channel = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        () => {
          getUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      {
        text: "Sí",
        onPress: async () => {
          try {
            await deleteUser(id);
            alert("Usuario eliminado correctamente");
          } catch (error: any) {
            alert("Error al eliminar: " + error.message);
          }
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      waiter: "Mesero",
      chef: "Cocinero",
      admin: "Administrador",
    };
    return roles[role as keyof typeof roles] || role;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: headerHeight }}
      >
        {users.map((user) => (
          <Card
            key={user.id}
            style={{
              marginHorizontal: 10,
              marginVertical: 8,
            }}
          >
            <Card.Title
              title={`${user.name} ${user.last_name}`}
              subtitle={getRoleLabel(user.role)}
              subtitleStyle={{ fontSize: 16 }}
              left={(props) => (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                  }}
                  source={{ uri: user.image_url }}
                />
              )}
            />
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => onDelete(user.id || "")}
              >
                Eliminar
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => router.push("/profile/users/add-user")}
      />
    </View>
  );
}
