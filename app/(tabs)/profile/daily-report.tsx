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

// Función unificada para calcular totales
const calculateOrderTotal = (order: IOrder): number => {
  return order.items.reduce(
    (sum, meal) => sum + (meal.price || 0) * (meal.quantity || 1),
    0
  );
};

type MonthlyTotals = {
  [key: string]: number;
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
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotals>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const loadDailySales = async () => {
    try {
      setLoading(true);
      const orders = await getDailyPaidOrders();
      const salesByHour = new Array(12).fill(0);
      let dailyTotal = 0;

      orders.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = new Date(order.date);
          const hour = orderDate.getHours();
          const timeIndex = Math.floor(hour / 2);
          const orderTotal = calculateOrderTotal(order);

          salesByHour[timeIndex] += orderTotal;
          dailyTotal += orderTotal;
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
    } catch (error) {
      console.error("Error loading daily sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyTotals = async (date: Date = currentDate) => {
    try {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const { data: monthOrders, error } = await supabase
        .from("orders")
        .select("*")
        .gte("date", startOfMonth.toISOString())
        .lte("date", endOfMonth.toISOString())
        .eq("paid", true)
        .eq("id_tenant", profile.id_tenant);

      if (error) throw error;

      const totals: MonthlyTotals = {};
      monthOrders?.forEach((order: IOrder) => {
        if (order.date) {
          const date = new Date(order.date).toISOString().split("T")[0];
          const orderTotal = calculateOrderTotal(order);
          totals[date] = (totals[date] || 0) + orderTotal;
        }
      });

      setMonthlyTotals(totals);
    } catch (error) {
      console.error("Error loading monthly totals:", error);
    }
  };

  useEffect(() => {
    void loadDailySales();
    void getMonthlyTotals();

    const subscription = supabase
      .channel("daily-reports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          void loadDailySales();
          void getMonthlyTotals();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentDate]);

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

  const MonthlyCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();

    const emptyDays = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allDays = [...emptyDays, ...days];

    const monthName = currentDate.toLocaleString("es-ES", { month: "long" });
    const year = currentDate.getFullYear();

    const navigateMonth = (direction: "prev" | "next") => {
      const newDate = new Date(currentDate);
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1)
      );
      setCurrentDate(newDate);
    };

    const dayNames = ["D", "L", "M", "X", "J", "V", "S"];

    return (
      <View style={styles.monthlyCalendarContainer}>
        <Text style={styles.weeklyTotalsTitle}>Totales calendarizados</Text>
        <View>
          <View className="flex flex-row justify-between items-center my-4">
            <TouchableOpacity onPress={() => navigateMonth("prev")}>
              <FontAwesome name="chevron-left" size={24} color="#FF6247" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth("next")}>
              <FontAwesome name="chevron-right" size={24} color="#FF6247" />
            </TouchableOpacity>
          </View>
          <View style={styles.monthDays}>
            {dayNames.map((day, index) => (
              <Text key={index} style={styles.monthDay}>
                {day}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.calendarGrid}>
          {allDays.map((day, index) => {
            if (day === null) {
              return (
                <View
                  key={`empty-${index}`}
                  style={[styles.calendarDay, styles.emptyDay]}
                />
              );
            }

            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            )
              .toISOString()
              .split("T")[0];
            const dayTotal = monthlyTotals[date] || 0;

            return (
              <View
                key={day}
                style={[
                  styles.calendarDay,
                  dayTotal > 0 && styles.calendarDayWithSales,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayNumber,
                    dayTotal > 0 && { color: "#fff" },
                  ]}
                >
                  {day}
                </Text>
                {dayTotal > 0 && (
                  <Text style={styles.calendarDayTotal}>
                    {dayTotal.toFixed(0)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

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
          <MonthlyCalendar />
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
  weeklyTotalsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  monthlyCalendarContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  monthDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  monthDay: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    width: "14.2%",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#333",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
  calendarDay: {
    width: "14.2%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  calendarDayWithSales: {
    backgroundColor: "#FF6247",
    borderWidth: 1,
    borderColor: "#FF6247",
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  calendarDayTotal: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
  },
  emptyDay: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
});