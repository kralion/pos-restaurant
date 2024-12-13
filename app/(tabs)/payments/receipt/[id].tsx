import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import * as Print from "expo-print";

import { Divider, Text, Button } from "react-native-paper";

export default function ReceiptScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>();
  const { getOrderById, loading } = useOrderContext();
  React.useEffect(() => {
    getOrderById(params.id).then((order) => {
      setOrder(order);
    });
  }, [params.id]);
  React.useEffect(() => {
    const channel = supabase
      .channel("table-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async () => {
          await supabase.from("orders").select("*");
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  if (!order) return <ActivityIndicator />;

  const generateHTML = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
        <html>
          <head>
            <style>
              @page {
                size: 80mm auto;
                margin: 0;
              }

              body {
                font-family: 'Courier New', monospace;
                width: 80mm;
                margin: 0;
                padding: 5mm;
                box-sizing: border-box;
              }

              /* Para impresión */
              @media print {
                body {
                  width: 80mm;
                }
                .page-break {
                  page-break-after: always;
                }
              }
              .logo {
                text-align: center;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .logo h1 {
                font-size: 24px;
              }
              .logo img {
                max-width: 150px;
                height: auto;
                margin: 0 auto;
                display: block;
              }
              .header-info {
                font-size: 12px;
                text-align: center;
                margin-bottom: 20px;
              }
              .table-info {
                margin-bottom: 15px;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
              }
              .items {
                width: 100%;
                margin-bottom: 15px;
              }
              .items td {
                padding: 3px 0;
              }
              .price-col {
                text-align: right;
              }
              .total-section {
                border-top: 1px solid #ccc;
                padding-top: 10px;
                margin-top: 10px;
              }
              .datetime {
                text-align: center;
                font-size: 12px;
                margin-top: 10px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="logo">
              <h1>RINCONCITO SURCUBAMBINO</h1>
            </div>

            <div class="header-info">
              Av.Huancavelica N°380<br>
              Tel: 923 008 282
            </div>

            <div class="table-info">
              Mesa: ${order.id_table}<br>
              Atendido por: ${order?.users?.name}<br>
              Para llevar: ${order.to_go ? "Sí" : "No"}
            </div>

            <table class="items">
              <tr>
                <th align="left">Ítem</th>
                <th align="center">Uds.</th>
                <th align="right">Precio</th>
                <th align="right">Total</th>
              </tr>
              ${[
                ...order.entradas,
                ...order.fondos,
                ...order.bebidas,
                ...order.helados,
              ]
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td align="center">${item.quantity}</td>
                  <td class="price-col">${item.price.toFixed(2)}</td>
                  <td class="price-col">${(item.price * item.quantity).toFixed(
                    2
                  )}</td>
                </tr>
              `
                )
                .join("")}
            </table>

            <div class="total-section">
              <table width="100%">

                <tr>
                  <td><strong>Total:</strong></td>
                  <td align="right"><strong>S/. ${total.toFixed(
                    2
                  )}</strong></td>
                </tr>
              </table>
            </div>

            <div class="datetime">
              Fecha: ${dateStr}<br>
              Hora: ${timeStr}
            </div>

            <div class="footer">
              GRACIAS POR SU VISITA<br>
            </div>
          </body>
        </html>
      `;
  };
  const printOrder = async () => {
    const html = generateHTML();
    await Print.printAsync({
      html,
    });
  };

  const total =
    order?.entradas?.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order?.bebidas?.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order?.helados?.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0) +
    order?.fondos?.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

  if (loading)
    return (
      <SafeAreaView className="h-screen items-center justify-center flex flex-col">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );

  return (
    <ScrollView
      className="p-4 bg-white"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex flex-col gap-12">
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text>Atendido por: </Text>
            <Text>{order.users?.name}</Text>
          </View>
          <Divider />
        </View>

        <View className="flex flex-col gap-4">
          <Text variant="titleMedium">Orden</Text>
          <Divider />
          <View className="flex flex-row justify-between">
            <Text variant="bodySmall" className="w-48">
              Item
            </Text>
            <Text variant="bodySmall">Precio</Text>
            <Text variant="bodySmall">Cantidad</Text>
          </View>
          {order.entradas.map((item, index) => (
            <View key={index} className="flex flex-row justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>S/. {item.price}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}

          {order.fondos.map((item, index) => (
            <View key={index} className="flex flex-row w-full justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>S/. {item.price}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}

          {order.bebidas.map((item, index) => (
            <View key={index} className="flex flex-row w-full justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>S/. {item.price}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}

          {order.helados.map((item, index) => (
            <View key={index} className="flex flex-row w-full justify-between">
              <Text className="w-36">{item.name}</Text>
              <Text>S/. {item.price}</Text>
              <Text>{item.quantity}</Text>
            </View>
          ))}
        </View>
        <View
          style={{
            height: 1,
            borderWidth: 1,
            borderColor: "gray",
            borderStyle: "dashed",
          }}
        />
        <View className="flex flex-col gap-3">
          <View className="flex flex-row justify-between">
            <Text variant="titleLarge">Total</Text>
            <Text variant="titleLarge">S/. {total.toFixed(2)}</Text>
          </View>
        </View>
        <Button mode="contained" onPress={() => printOrder()}>
          Imprimir Boleta
        </Button>
      </View>
    </ScrollView>
  );
}
