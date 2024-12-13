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

type DayTotals = {
  [key in 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday']: number;
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
  const [totalDailySales, setTotalDailySales] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    totalOrders: 0,
    totalAmount: 0,
    peakHour: "",
    totalWeekly: 0,
  });
  const [dailyTotals, setDailyTotals] = useState<DayTotals>({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  });

  useEffect(() => {
    loadDailySales();
    getWeekDayTotals();
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
  const getWeekDayTotals = async () => {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: weekOrders, error } = await supabase
        .from("orders")
        .select("*")
        .gte("date", startOfWeek.toISOString())
        .lte("date", today.toISOString())
        .eq("paid", true);

      if (error) throw error;

      const totals: DayTotals = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      };

      weekOrders?.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = new Date(order.date);
          const dayName = orderDate.toLocaleString('en-US', { weekday: 'long' }) as keyof DayTotals;
          totals[dayName] += calculateOrderTotal(order);
        }
      });

      setDailyTotals(totals);
    } catch (error) {
      console.error("Error loading weekly totals:", error);
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
  const WeeklyTotals = () => (
    <View style={styles.weeklyTotalsContainer}>
      <Text style={styles.weeklyTotalsTitle}>Totales por día de la semana</Text>
      {Object.entries(dailyTotals).map(([day, total]) => (
        <Text key={day} style={styles.weeklyTotalItem}>
          {day === 'Monday' ? 'Lunes' :
           day === 'Tuesday' ? 'Martes' :
           day === 'Wednesday' ? 'Miércoles' :
           day === 'Thursday' ? 'Jueves' :
           day === 'Friday' ? 'Viernes' :
           day === 'Saturday' ? 'Sábado' : 'Domingo'}: S/. {total.toFixed(2)}
        </Text>
      ))}
    </View>
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
        <WeeklyTotals />
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
  weeklyTotalsContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  weeklyTotalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  weeklyTotalItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
