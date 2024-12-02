import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import {
  Button,
  Divider,
  Modal,
  Portal,
  Switch,
  Text,
} from "react-native-paper";

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

  const [paid, setPaid] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

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
          <Divider />
          <View className="flex flex-row justify-between">
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              {paid ? "Pagado" : "Sin Pagar"}
            </Text>
            <Switch value={paid} onValueChange={() => setModalVisible(true)} />;
          </View>
        </View>

        <Button
          mode="contained-tonal"
          onPress={() => router.push("/(tabs)/tables")}
          className="mb-4"
        >
          Volver a Mesas
        </Button>

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
        {paid ? (
          <Button
            mode="contained"
            onPress={() => alert("Conecte la impresora")}
          >
            Imprimir Boleta
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => alert("Conecte la impresora")}
            disabled
          >
            Imprimir Boleta
          </Button>
        )}
      </View>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View className="p-4 bg-white mx-4 rounded-lg flex flex-col gap-16">
            <View className="flex flex-row gap-4 items-center">
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={{
                  uri: "https://img.icons8.com/?size=100&id=VQOfeAx5KWTK&format=png&color=000000",
                }}
              />
              <View className="flex flex-col gap-1">
                <Text variant="titleMedium">Estado del pedido</Text>
                <Text>Estas seguro de cambiar el </Text>
                <Text> estado de la orden ?</Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={() => {
                setPaid(!paid);
                setModalVisible(false);
              }}
            >
              Confirmar
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}
