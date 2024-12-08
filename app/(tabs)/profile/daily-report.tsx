import { View, Text, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";
import { useOrderContext } from "@/context/order";
import { IOrder, IMeal } from "@/interfaces";
import { supabase } from "@/utils/supabase";
// Helper function to calculate order total
const calculateOrderTotal = (order: IOrder): number => {
  const getMealsTotal = (meals: IMeal[]) =>
    meals.reduce(
      (sum, meal) => sum + (meal.price || 0) * (meal.quantity || 1),
      0
    );
  return (
    getMealsTotal(order.entradas || []) +
    getMealsTotal(order.fondos || []) +
    getMealsTotal(order.bebidas || [])
  );
};

export default function DailyReportScreen() {
  const { getDailyPaidOrders } = useOrderContext();
  const [dailySales, setDailySales] = useState([
    { value: 0, label: "8 AM", frontColor: "#177AD5" },
    { value: 0, label: "10 AM", frontColor: "#177AD5" },
    { value: 0, label: "12 PM", frontColor: "#177AD5" },
    { value: 0, label: "2 PM", frontColor: "#177AD5" },
    { value: 0, label: "4 PM", frontColor: "#177AD5" },
    { value: 0, label: "6 PM", frontColor: "#177AD5" },
    { value: 0, label: "8 PM", frontColor: "#177AD5" },
  ]);
  const [weeklySales, setWeeklySales] = useState([
    { value: 0, label: "Lun", frontColor: "#4CAF50" },
    { value: 0, label: "Mar", frontColor: "#4CAF50" },
    { value: 0, label: "Mier", frontColor: "#4CAF50" },
    { value: 0, label: "Juev", frontColor: "#4CAF50" },
    { value: 0, label: "Vier", frontColor: "#4CAF50" },
    { value: 0, label: "Sab", frontColor: "#4CAF50" },
    { value: 0, label: "Dom", frontColor: "#4CAF50" },
  ]);
  const [totalDailySales, setTotalDailySales] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    totalOrders: 0,
    totalAmount: 0,
    peakHour: "",
    totalWeekly: 0,
  });
  useEffect(() => {
    loadDailySales();
    // Suscribirse a cambios en orders
    const subscription = supabase
      .channel("daily-reports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadDailySales(); // Recargar datos cuando haya cambios
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const loadDailySales = async () => {
    try {
      const orders = await getDailyPaidOrders();

      const salesByHour = new Array(7).fill(0);
      let total = 0;
      orders.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = new Date(order.date);
          const hour = orderDate.getHours();
          const timeIndex = Math.floor((hour - 8) / 2);

          if (timeIndex >= 0 && timeIndex < salesByHour.length) {
            const orderTotal = calculateOrderTotal(order);
            salesByHour[timeIndex] += orderTotal;
            total += orderTotal;
          }
        }
      });
      setDailySales((prev) =>
        prev.map((item, index) => ({
          ...item,
          value: salesByHour[index],
        }))
      );
      setTotalDailySales(total);
      // Calcular detalles adicionales
      const peakHourIndex = salesByHour.indexOf(Math.max(...salesByHour));
      setOrderDetails({
        totalOrders: orders.length,
        totalAmount: total,
        peakHour: dailySales[peakHourIndex]?.label || "N/A",
        totalWeekly: orderDetails.totalWeekly + total, // Acumular total diario en total semanal
      });
    } catch (error) {
      console.error("Error loading daily sales:", error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // Reiniciar datos diarios a medianoche
        setDailySales([
          { value: 0, label: "8 AM", frontColor: "#177AD5" },
          { value: 0, label: "10 AM", frontColor: "#177AD5" },
          { value: 0, label: "12 PM", frontColor: "#177AD5" },
          { value: 0, label: "2 PM", frontColor: "#177AD5" },
          { value: 0, label: "4 PM", frontColor: "#177AD5" },
          { value: 0, label: "6 PM", frontColor: "#177AD5" },
          { value: 0, label: "8 PM", frontColor: "#177AD5" },
        ]);
        setTotalDailySales(0);
      }
    }, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, []);
  const SalesDetails = ({
    title,
    data,
  }: {
    title: string;
    data: number | string;
  }) => (
    <Text style={styles.detailText}>
      {title}: {typeof data === "number" ? `${data}` : data}
    </Text>
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Ventas diarias</Text>
          <Text style={styles.totalSales}>
            Total: ${totalDailySales.toFixed(2)}
          </Text>
          <BarChart
            data={dailySales}
            barWidth={30}
            spacing={20}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={1}
            yAxisThickness={1}
            yAxisTextStyle={styles.chartText}
            xAxisLabelTextStyle={styles.chartText}
            noOfSections={5}
          />
          <View style={styles.detailsContainer}>
            <SalesDetails
              title="Total de pedidos"
              data={orderDetails.totalOrders}
            />
            <SalesDetails
              title="Total de ventas"
              data={`S/. ${orderDetails.totalAmount.toFixed(2)}`}
            />
            <SalesDetails title="Hora pico" data={orderDetails.peakHour} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  chartContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  chartText: {
    color: "#333",
    fontSize: 12,
  },
  totalSales: {
    fontSize: 16,
    fontWeight: "600",
    color: "#177AD5",
    marginBottom: 12,
  },
  detailsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});
