import { IMeal, IOrder } from "@/interfaces";
import { supabase } from "./supabase";
type DayTotals = {
  [key in
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"]: number;
};
type MonthlyTotals = {
  [key: string]: number;
};
export const weekDayTotals = async (id_tenant: string) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("orders")
    .select("*")
    .gte("date", startOfWeek.toISOString())
    .lte("date", today.toISOString())
    .eq("paid", true)
    .eq("id_tenant", id_tenant);

  const totals: DayTotals = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  data?.forEach((order: IOrder) => {
    if (order.date) {
      const orderDate = new Date(order.date);
      const dayName = orderDate.toLocaleString("en-US", {
        weekday: "long",
      }) as keyof DayTotals;
      totals[dayName] += order.total;
    }
  });

  return totals;
};

const calculateOrderTotal = (order: IOrder): number => {
  const getMealsTotal = (meals: IMeal[]) =>
    meals.reduce(
      (sum, meal) => sum + (meal.price || 0) * (meal.quantity || 1),
      0
    );
  return getMealsTotal(order.items);
};

export const monthlyTotalsSales = async (date: Date, id_tenant: string) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const { data: monthOrders, error } = await supabase
    .from("orders")
    .select("*")
    .gte("date", startOfMonth.toISOString())
    .lte("date", endOfMonth.toISOString())
    .eq("paid", true)
    .eq("id_tenant", id_tenant);

  if (error) throw error;

  const totals: MonthlyTotals = {};
  let monthTotal = 0;

  monthOrders?.forEach((order: IOrder) => {
    if (order.date) {
      const date = new Date(order.date).toISOString().split("T")[0];
      totals[date] = (totals[date] || 0) + calculateOrderTotal(order);
      monthTotal += calculateOrderTotal(order);
    }
  });
  return monthTotal;
};
