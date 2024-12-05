import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FAB, List, Text } from "react-native-paper";
import { supabase } from "@/utils/supabase";
import { IUser } from "@/interfaces";
import { useRouter } from "expo-router";

export default function UsersScreen() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <ScrollView>
        <List.Section>
          {users.map((user) => (
            <List.Item
              key={user.id}
              title={user.name}
              description={`Usuario: ${user.username} - Rol: ${getRoleLabel(
                user.role
              )}`}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
          ))}
        </List.Section>
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
