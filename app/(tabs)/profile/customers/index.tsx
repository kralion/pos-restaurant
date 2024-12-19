import { useCustomer } from "@/context/customer";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Card, Divider, FAB, IconButton, Text } from "react-native-paper";

export default function CustomersScreen() {
  const { deleteCustomer, customers, getCustomers } = useCustomer();
  React.useEffect(() => {
    getCustomers();
  }, [customers]);
  const router = useRouter();

  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este cliente?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCustomer(id);
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

  return (
    <View className="flex-1">
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <FlashList
          renderItem={({ item: customer }) => (
            <Card
              key={customer.id}
              style={{
                marginHorizontal: 16,
                marginVertical: 8,
              }}
            >
              <Card.Title
                title={`${customer.full_name}`}
                subtitleStyle={{ fontSize: 16 }}
                left={(props) => (
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                    }}
                    source={{
                      uri: "https://img.icons8.com/?size=100&id=n8DrUm77sR3l&format=png&color=FD7E14",
                    }}
                  />
                )}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete-outline"
                    onPress={() => onDelete(customer.id || "")}
                  />
                )}
              />
              <Card.Content>
                <Divider className="mb-4" />
                <View className="flex flex-row  justify-between">
                  <Text variant="bodyMedium" style={{ color: "gray" }}>
                    Total Pedidos : {customer.total_orders}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: "gray" }}>
                    Pedidos Gratis : {customer.total_free_orders}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}
          data={customers}
          estimatedItemSize={200}
          horizontal={false}
        />
      </ScrollView>

      <FAB
        icon="account-multiple-plus-outline"
        variant="tertiary"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => router.push("/profile/customers/add-customer")}
      />
    </View>
  );
}
