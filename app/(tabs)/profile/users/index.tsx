import { useAuth } from "@/context/auth";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, FAB, IconButton } from "react-native-paper";

export default function UsersScreen() {
  const { deleteUser, users, getUsers, profile } = useAuth();

  React.useEffect(() => {
    if (!profile.id_tenant) return;
    getUsers(profile.id_tenant);
    console.log(profile.id_tenant);
  }, [profile.id_tenant]);

  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este usuario?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(id);
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

  return (
    <View className="flex-1">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: headerHeight }}
      >
        <FlashList
          renderItem={({ item: user }) => (
            <Card
              key={user.id}
              style={{
                margin: 16,
              }}
            >
              <Card.Title
                title={`${user.name} ${user.last_name}`}
                subtitle={getRoleLabel(user.role)}
                right={(props) => (
                  <IconButton
                    icon="delete-outline"
                    onPress={() => onDelete(user.id as string)}
                    {...props}
                  />
                )}
                left={(props) => (
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                    }}
                    source={{ uri: user.image_url }}
                  />
                )}
              />
            </Card>
          )}
          data={users}
          estimatedItemSize={200}
          horizontal={false}
        />
      </ScrollView>

      <FAB
        icon="account-plus-outline"
        variant="tertiary"
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
