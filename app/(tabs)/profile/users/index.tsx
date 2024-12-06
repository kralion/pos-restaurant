import { View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FAB,
  IconButton,
  List,
  Text,
} from "react-native-paper";
import { supabase } from "@/utils/supabase";
import { IUser } from "@/interfaces";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useHeaderHeight } from "@react-navigation/elements";

export default function UsersScreen() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const headerHeight = useHeaderHeight();

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
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: headerHeight }}
      >
        <List.Section>
          {users.map((user) => (
            <List.Item
              style={{ marginHorizontal: 16 }}
              key={user.id}
              title={`${user.name} ${user.last_name}`}
              description={user.role}
              left={(props) => (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                  }}
                  source={{ uri: user.image_url }}
                />
              )}
              right={() => (
                <IconButton
                  icon="chevron-right"
                  onPress={() => router.push(`/profile/users/user/${user.id}`)}
                />
              )}
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
