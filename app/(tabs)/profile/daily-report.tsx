import { useAuth } from "@/context";
import { useOrderContext } from "@/context/order";
import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { ActivityIndicator } from "react-native-paper";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

// Función unificada para calcular totales
const calculateOrderTotal = (order: IOrder): number => {
  return order.items.reduce(
    (sum, meal) => sum + (meal.price || 0) * (meal.quantity || 1),
    0
  );
};

export default function DailyReportScreen() {
  const { getDailyPaidOrders } = useOrderContext();
  const { profile } = useAuth();
  const [dailySales, setDailySales] = useState([
    { value: 0, label: "12 AM", frontColor: "#FF6247" },
    { value: 0, label: "2 AM", frontColor: "#FF6247" },
    { value: 0, label: "4 AM", frontColor: "#FF6247" },
    { value: 0, label: "6 AM", frontColor: "#FF6247" },
    { value: 0, label: "8 AM", frontColor: "#FF6247" },
    { value: 0, label: "10 AM", frontColor: "#FF6247" },
    { value: 0, label: "12 PM", frontColor: "#FF6247" },
    { value: 0, label: "2 PM", frontColor: "#FF6247" },
    { value: 0, label: "4 PM", frontColor: "#FF6247" },
    { value: 0, label: "6 PM", frontColor: "#FF6247" },
    { value: 0, label: "8 PM", frontColor: "#FF6247" },
    { value: 0, label: "10 PM", frontColor: "#FF6247" },
  ]);
  const [totalDailySales, setTotalDailySales] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    totalOrders: 0,
    totalAmount: 0,
    peakHour: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyTotals, setDailyTotals] = useState<{ [key: string]: number }>({});

  const loadDailySales = async () => {
    try {
      setLoading(true);
      const orders = await getDailyPaidOrders();
      const salesByHour = new Array(12).fill(0);
      let dailyTotal = 0;
      const newDailyTotals: { [key: string]: number } = {};

      orders.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = new Date(order.date);
          const hour = orderDate.getHours();
          const timeIndex = Math.floor(hour / 2);
          const orderTotal = calculateOrderTotal(order);

          salesByHour[timeIndex] += orderTotal;
          dailyTotal += orderTotal;

          const orderDateString = orderDate.toISOString().split('T')[0];
          if (!newDailyTotals[orderDateString]) {
            newDailyTotals[orderDateString] = 0;
          }
          newDailyTotals[orderDateString] += orderTotal;
        }
      });

      setDailySales((prev) =>
        prev.map((item, index) => ({
          ...item,
          value: salesByHour[index],
        }))
      );

      const peakHourIndex = salesByHour.indexOf(Math.max(...salesByHour));
      
      setTotalDailySales(dailyTotal);
      setOrderDetails({
        totalOrders: orders.length,
        totalAmount: dailyTotal,
        peakHour: dailySales[peakHourIndex]?.label || "N/A",
      });
      setDailyTotals(newDailyTotals);
    } catch (error) {
      console.error("Error loading daily sales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDailySales();

    const subscription = supabase
      .channel("daily-reports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          void loadDailySales();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
    >
      {loading ? (
        <View className="flex flex-col gap-4 mt-24 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text style={{ color: "gray" }}>Cargando datos...</Text>
        </View>
      ) : (
        <>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>Ventas diarias</Text>
            <Text style={styles.totalSales}>
              Total: S/. {totalDailySales.toFixed(2)}
            </Text>
            <BarChart
              data={dailySales}
              barWidth={30}
              barBorderRadius={6}
              xAxisThickness={0}
              yAxisThickness={0}
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
          <Calendar
            onDayPress={(day : any) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, marked: true, selectedColor: '#FF6247' },
              ...Object.keys(dailyTotals).reduce((acc, date) => {
                acc[date] = { marked: true, dotColor: '#FF6247' };
                return acc;
              }, {} as { [key: string]: { marked: boolean, dotColor: string } }),
            }}
          />
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              {selectedDate}: S/. {dailyTotals[selectedDate]?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  chartContainer: {
    marginBottom: 24,
    padding: 16,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: "ultralight",
    color: "gray",
  },
  chartText: {
    color: "gray",
    fontSize: 12,
  },
  totalSales: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF6247",
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
  selectedDateContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6247',
  },
});