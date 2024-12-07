import { View, Text, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";
import { useOrderContext } from "@/context/order";
import { IOrder, IMeal } from "@/interfaces";
import { supabase } from "@/utils/supabase";

// Helper function to calculate order total
const calculateOrderTotal = (order: IOrder): number => {
  const getMealsTotal = (meals: IMeal[]) => 
    meals.reduce((sum, meal) => sum + (meal.price || 0), 0);

  return getMealsTotal(order.entradas || []) +
         getMealsTotal(order.fondos || []) +
         getMealsTotal(order.bebidas || []);
};

export default function DailyReportScreen() {
  const { getDailyPaidOrders } = useOrderContext();
  const [dailySales, setDailySales] = useState([
    { value: 0, label: '8 AM', frontColor: '#177AD5' },
    { value: 0, label: '10 AM', frontColor: '#177AD5' },
    { value: 0, label: '12 PM', frontColor: '#177AD5' },
    { value: 0, label: '2 PM', frontColor: '#177AD5' },
    { value: 0, label: '4 PM', frontColor: '#177AD5' },
    { value: 0, label: '6 PM', frontColor: '#177AD5' },
    { value: 0, label: '8 PM', frontColor: '#177AD5' },
  ]);

  const [weeklySales, setWeeklySales] = useState([
    { day: 'Domingo', value: 0 }, // índice 0
    { day: 'Lunes', value: 0 },   // índice 1
    { day: 'Martes', value: 0 },  // índice 2
    { day: 'Miércoles', value: 0 },// índice 3
    { day: 'Jueves', value: 0 },  // índice 4
    { day: 'Viernes', value: 0 }, // índice 5
    { day: 'Sábado', value: 0 },  // índice 6
  ]);

  const [totalDailySales, setTotalDailySales] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    totalOrders: 0,
    totalAmount: 0,
    peakHour: '',
    totalWeekly: 0
  });

  useEffect(() => {
    loadDailySales();
    // Suscribirse a cambios en orders
    const subscription = supabase
      .channel('daily-reports')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
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
      // Obtener fecha inicio (hoy a las 00:00:00) y fin (mañana a las 00:00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Obtener pedidos pagados de hoy
      const { data: todayOrders, error: todayError } = await supabase
        .from('orders')
        .select('*')
        .eq('paid', true)
        .gte('date', today.toISOString())
        .lt('date', tomorrow.toISOString());

      if (todayError) throw todayError;

      const salesByHour = new Array(7).fill(0);
      let totalDaily = 0;

      todayOrders?.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = new Date(order.date);
          const hour = orderDate.getHours();
          const timeIndex = Math.floor((hour - 8) / 2);
          
          if (timeIndex >= 0 && timeIndex < salesByHour.length) {
            const orderTotal = calculateOrderTotal(order);
            salesByHour[timeIndex] += orderTotal;
            totalDaily += orderTotal;
          }
        }
      });

      // Actualizar ventas diarias
      setDailySales(prev => 
        prev.map((item, index) => ({
          ...item,
          value: salesByHour[index]
        }))
      );

      setTotalDailySales(totalDaily);

      // Obtener ventas de la última semana
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7);

      const { data: weekOrders, error: weekError } = await supabase
        .from('orders')
        .select('*')
        .eq('paid', true)
        .gte('date', lastWeekStart.toISOString())
        .lt('date', tomorrow.toISOString());

      if (weekError) throw weekError;

      const salesByDay = new Array(7).fill(0);
      let weeklyTotal = 0;

      weekOrders?.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = new Date(order.date);
          // getDay() devuelve 0-6 (Domingo-Sábado)
          const dayIndex = orderDate.getDay(); // Ahora usamos el índice directamente
          const orderTotal = calculateOrderTotal(order);
          salesByDay[dayIndex] += orderTotal;
          weeklyTotal += orderTotal;

          console.log(`Fecha: ${orderDate.toLocaleDateString()}, Día: ${dayIndex}, Total: ${orderTotal}`);
        }
      });

      setWeeklySales(prev => 
        prev.map((item, index) => ({
          ...item,
          value: salesByDay[index]
        }))
      );

      // Actualizar detalles
      const peakHourIndex = salesByHour.indexOf(Math.max(...salesByHour));
      setOrderDetails({
        totalOrders: todayOrders?.length || 0,
        totalAmount: totalDaily,
        peakHour: dailySales[peakHourIndex]?.label || 'N/A',
        totalWeekly: weeklyTotal
      });

    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  const SalesDetails = ({ title, data }: { title: string; data: number | string }) => (
    <Text style={styles.detailText}>{title}: {typeof data === 'number' ? `${data}` : data}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Ventas diarias</Text>
          <Text style={styles.totalSales}>Total: ${totalDailySales.toFixed(2)}</Text>
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
            <SalesDetails title="Total de pedidos" data={orderDetails.totalOrders} />
            <SalesDetails title="Total de ventas" data={`S/. ${orderDetails.totalAmount.toFixed(2)}`} />
            <SalesDetails title="Hora pico" data={orderDetails.peakHour} />
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.title}>Ventas semanales</Text>
          <View style={styles.detailsContainer}>
            {weeklySales.map((day, index) => (
              <Text key={index} style={styles.detailText}>
                {day.day}: S/. {day.value.toFixed(2)}
              </Text>
            ))}
            <Text style={[styles.detailText, styles.totalWeekly]}>
              Total semanal: S/. {orderDetails.totalWeekly.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  chartContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  chartText: {
    color: '#333',
    fontSize: 12,
  },
  totalSales: {
    fontSize: 16,
    fontWeight: '600',
    color: '#177AD5',
    marginBottom: 12,
  },
  detailsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalWeekly: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontSize: 16,
  },
});
