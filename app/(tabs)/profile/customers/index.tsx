import { useCustomer } from "@/context/customer";
import { useHeaderHeight } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Divider, FAB, Text } from "react-native-paper";

export default function CustomersScreen() {
  const { deleteCustomer, customers, getCustomers } = useCustomer();
  React.useEffect(() => {
    getCustomers();
  }, [customers]);
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  const onDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro de eliminar este cliente?", [
      {
        text: "Sí",
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
                marginHorizontal: 10,
                marginVertical: 8,
              }}
            >
              <Card.Title
                title={`${customer.full_name}`}
                subtitleStyle={{ fontSize: 16 }}
                // left={(props) => (
                //   <Image
                //     style={{
                //       width: 50,
                //       height: 50,
                //       borderRadius: 25,
                //     }}
                //     source={{ uri: customer.image_url }}
                //   />
                // )}
              />
              <Card.Content>
                <Divider className="mb-4" />
                <Text variant="bodyMedium">
                  Total Pedidos : {customer.total_orders}
                </Text>
                <Text variant="bodyMedium">
                  Pedidos Gratis : {customer.total_free_orders}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => onDelete(customer.id || "")}
                >
                  Eliminar
                </Button>
              </Card.Actions>
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
