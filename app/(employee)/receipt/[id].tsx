import { Image, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Divider, Text } from "react-native-paper";

export default function HomeScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const headerHeight = useHeaderHeight();
  const order = [
    {
      id: 1,
      name: "Pepe",
      table: "2",
      date: "2023-01-01",
      entradas: [
        {
          meal: "Tacos",
          price: 10,
          quantity: 2,
        },
        {
          meal: "Quesadilla",
          price: 10,
          quantity: 1,
        },
      ],
      bebidas: [
        {
          meal: "Agua",
          price: 10,
          quantity: 1,
        },
        {
          meal: "Limonada",
          price: 10,
          quantity: 1,
        },
      ],
    },
  ];

  const subTotal =
    order[0].entradas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order[0].bebidas.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

  const total = subTotal + subTotal * 0.18;

  return (
    <ScrollView className="p-4" contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-col gap-12">
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>Mesa</Text>
            <Text> {order[0].table}</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text>Mozo</Text>
            <Text>Jhon Doe</Text>
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <Text variant="titleMedium">Orden</Text>
          <Divider />
          <View className="flex flex-col gap-4">
            <View className="flex flex-row justify-between">
              <Text variant="bodySmall" className="w-48">
                Entradas
              </Text>
              <Text variant="bodySmall">Precio</Text>
              <Text variant="bodySmall">Cantidad</Text>
            </View>
            {order[0].entradas.map((item, index) => (
              <View key={index} className="flex flex-row justify-between">
                <Text className="w-36">{item.meal}</Text>
                <Text>S/. {item.price}.00</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>
          <Divider />
          <View className="flex flex-col gap-4">
            <Text variant="bodySmall" className="w-48 ">
              Bebidas
            </Text>

            {order[0].bebidas.map((item, index) => (
              <View
                key={index}
                className="flex flex-row w-full justify-between"
              >
                <Text className="w-36">{item.meal}</Text>
                <Text>S/. {item.price}.00</Text>
                <Text>{item.quantity}</Text>
              </View>
            ))}
          </View>
          <Divider />
        </View>

        <Divider className="border-dashed border-2" />
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>SubTotal</Text>
            <Text>S/. {subTotal}.00</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text>Impuestos</Text>
            <Text>S/. {subTotal * 0.18}.00</Text>
          </View>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text>Total</Text>
            <Text variant="titleLarge">S/. {total}.00</Text>
          </View>
        </View>

        <Button mode="contained" onPress={() => alert("Conecte la impresora")}>
          Imprimir Boleta
        </Button>
      </View>
    </ScrollView>
  );
}