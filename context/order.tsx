import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase";
import { IOrder, IOrderContextProvider } from "@/interfaces";
import { router } from "expo-router";

export const OrderContext = createContext<IOrderContextProvider>({
  addOrder: async () => {},
  getUnservedOrders: async () => [],
  getOrderById: async (id: string): Promise<IOrder> => ({} as IOrder),
  orders: [],
  order: {} as IOrder,
  getPaidOrders: async () => [],
  deleteOrder: async () => {},
  getOrders: async () => [],
  updateOrderServedStatus: async () => {},
  paidOrders: [],
  getDailyPaidOrders: async () => [],
});

export const OrderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [order, setOrder] = React.useState<IOrder>({} as IOrder);
  const [paidOrders, setPaidOrders] = React.useState<IOrder[]>([]);

  React.useEffect(() => {
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          // Recargar los pedidos cuando haya cambios
          if (payload.eventType === 'INSERT' || 
              payload.eventType === 'UPDATE' || 
              payload.eventType === 'DELETE') {
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

  const addOrder = async (order: IOrder, tableId: string) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(order);

      if (orderError) {
        console.error("Error inserting order:", orderError);
        alert("Error al registrar pedido");
        return;
      }

      const { data: tableData, error: tableError } = await supabase
        .from("tables")
        .update({ status: false })
        .eq("id", tableId);

      if (tableError) {
        console.error("Error updating table status:", tableError);
        alert("Error al actualizar status da mesa");
        return;
      }

      alert("Pedido registrado");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Erro al procesar pedido");
    }
  };

  const getOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) throw error;
    setOrders(data);
    return data;
  };

  async function getUnservedOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("served", false)
      .limit(15);
    if (error) throw error;
    return data;
  }

  async function getPaidOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .limit(15);
    if (error) throw error;
    setPaidOrders(data);
    return data;
  }
  const updateOrderServedStatus = async (id: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ served: true })
      .eq("id", id);
    if (error) throw error;
    console.log("Order updated", error);
  };

  const deleteOrder = async (id: string) => {
    await supabase.from("orders").delete().eq("id", id);
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  async function getOrderById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*, users:id_waiter(name)")
      .eq("id", id)
      .single();
    if (error) throw error;
    setOrder(data);
    return data;
  }

  async function getDailyPaidOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .gte("date", today.toISOString())
      .order("date");

    if (error) throw error;
    return data;
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        getOrders,
        deleteOrder,
        getOrderById,
        paidOrders,
        getPaidOrders,
        getUnservedOrders,
        addOrder,
        updateOrderServedStatus,
        order,
        getDailyPaidOrders,
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
