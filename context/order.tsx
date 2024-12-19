import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase";
import { IOrder, IOrderContextProvider } from "@/interfaces";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "./auth";
export const OrderContext = createContext<IOrderContextProvider>({
  addOrder: async () => {},
  getUnservedOrders: async () => [],
  getOrderById: async (id: string): Promise<IOrder> => ({} as IOrder),
  orders: [],
  order: {} as IOrder,
  loading: false,
  getPaidOrders: async () => [],
  updateOrder: async () => {},
  deleteOrder: async () => {},
  getOrders: async () => [],
  updateOrderServedStatus: async () => {},
  paidOrders: [],
  getDailyPaidOrders: async () => [],
  getUnpaidOrders: async () => [],
});

export const OrderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [order, setOrder] = React.useState<IOrder>({} as IOrder);
  const { profile } = useAuth();
  const [paidOrders, setPaidOrders] = React.useState<IOrder[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async (payload) => {
          // Recargar los pedidos cuando haya cambios
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE" ||
            payload.eventType === "DELETE"
          ) {
            await getOrders();
            await getPaidOrders();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addOrder = async (order: IOrder) => {
    setLoading(true);
    const updates = order.items.map((meal) => ({
      id: meal.id,
      quantity: meal.quantity - order.items.length,
    }));
    try {
      const { error } = await supabase.from("orders").insert({
        ...order,
        id_tenant: profile.id_tenant,
      });
      if (error) {
        console.error("Error inserting order:", error);
        return;
      }
      await supabase.from("meals").upsert(updates);

      if (!order.to_go) {
        await supabase
          .from("tables")
          .update({ status: false })
          .eq("id", order.id_table);
      }
      setLoading(false);
      toast.success("Pedido agregado!", {
        icon: <FontAwesome name="check-circle" size={20} color="green" />,
      });
      router.back();
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Error al procesar pedido");
    }
  };

  const getOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id_tenant", profile.id_tenant)
      .order("date", { ascending: false });
    if (error) throw error;
    setOrders(data);
    setLoading(false);
    return data;
  };

  async function getUnservedOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id_tenant", profile.id_tenant)
      .eq("served", false);
    if (error) throw error;
    setLoading(false);
    return data;
  }

  async function getPaidOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .eq("id_tenant", profile.id_tenant)
      .order("date", { ascending: false });
    if (error) throw error;
    setPaidOrders(data);
    setLoading(false);
    return data;
  }
  const updateOrderServedStatus = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ served: true })
      .eq("id", id);
    if (error) throw error;
    toast.success("Pedido servido!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    console.log("Order updated", error);
    setLoading(false);
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    await supabase.from("orders").delete().eq("id", id);
    setLoading(false);
    toast.success("Pedido eliminado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  async function getOrderById(id: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        "*, users:id_waiter(name), customers:id_fixed_customer(full_name)"
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    setLoading(false);
    setOrder(data);
    return data;
  }

  async function updateOrder(order: IOrder) {
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update(order)
      .eq("id", order.id);
    toast.success("Pedido actualizado!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
    router.back();
    if (error) console.error("Update Error", error);
    setLoading(false);
  }

  async function getDailyPaidOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .eq("id_tenant", profile.id_tenant)
      .gte("date", today.toISOString())
      .order("date");
    if (error) throw error;
    setLoading(false);
    return data;
  }

  async function getUnpaidOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", false)
      .eq("id_tenant", profile.id_tenant);
    if (error) throw error;
    setLoading(false);
    return data;
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrders,
        deleteOrder,
        loading,
        getOrderById,
        paidOrders,
        getPaidOrders,
        getUnservedOrders,
        updateOrder,
        addOrder,
        updateOrderServedStatus,
        order,
        getDailyPaidOrders,
        getUnpaidOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within a OrderProvider");
  }
  return context;
};
