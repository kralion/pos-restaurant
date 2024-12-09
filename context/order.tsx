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
  loading: false,
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

  const addOrder = async (order: IOrder, tableId: string) => {
    setLoading(true);
    try {
      for (const item of order.entradas) {
        const { data: mealData, error: mealError } = await supabase
          .from("meals")
          .select("quantity")
          .eq("id", item.id)
          .single();

        if (mealError) {
          console.error("Error retrieving meal quantity:", mealError);
          alert("Error al verificar inventario");
          return;
        }

        // Check if there's enough quantity
        if (mealData.quantity < item.quantity) {
          alert(`No hay en el inventario`);
          return;
        }

        // Update meal quantity
        const { error: updateError } = await supabase
          .from("meals")
          .update({ quantity: mealData.quantity - item.quantity })
          .eq("id", item.id);

        if (updateError) {
          console.error("Error updating meal quantity:", updateError);
          alert("Error al actualizar inventario");
          return;
        }
      }
      for (const item of order.fondos) {
        const { data: mealData, error: mealError } = await supabase
          .from("meals")
          .select("quantity")
          .eq("id", item.id)
          .single();

        if (mealError) {
          console.error("Error retrieving meal quantity:", mealError);
          alert("Error al verificar inventario");
          return;
        }

        // Check if there's enough quantity
        if (mealData.quantity < item.quantity) {
          alert(`No hay en el inventario`);
          return;
        }

        // Update meal quantity
        const { error: updateError } = await supabase
          .from("meals")
          .update({ quantity: mealData.quantity - item.quantity })
          .eq("id", item.id);

        if (updateError) {
          console.error("Error updating meal quantity:", updateError);
          alert("Error al actualizar inventario");
          return;
        }
      }
      for (const item of order.bebidas) {
        const { data: mealData, error: mealError } = await supabase
          .from("meals")
          .select("quantity")
          .eq("id", item.id)
          .single();

        if (mealError) {
          console.error("Error retrieving meal quantity:", mealError);
          alert("Error al verificar inventario");
          return;
        }

        // Check if there's enough quantity
        if (mealData.quantity < item.quantity) {
          alert(`No hay en el inventario`);
          return;
        }

        // Update meal quantity
        const { error: updateError } = await supabase
          .from("meals")
          .update({ quantity: mealData.quantity - item.quantity })
          .eq("id", item.id);

        if (updateError) {
          console.error("Error updating meal quantity:", updateError);
          alert("Error al actualizar inventario");
          return;
        }
      }
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
      setLoading(false);
      alert("Pedido registrado");
      router.back();
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Error al procesar pedido");
    }
  };

  const getOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*");
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
      .eq("paid", true);
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
    console.log("Order updated", error);
    setLoading(false);
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    await supabase.from("orders").delete().eq("id", id);
    setLoading(false);
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  async function getOrderById(id: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, users:id_waiter(name)")
      .eq("id", id)
      .single();
    if (error) throw error;
    setLoading(false);
    setOrder(data);
    return data;
  }

  async function getDailyPaidOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("paid", true)
      .gte("date", today.toISOString())
      .order("date");

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
