import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase";
import { IOrder, IOrderContextProvider } from "@/interfaces";

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
});

export const OrderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [order, setOrder] = React.useState<IOrder>({} as IOrder);
  const [paidOrders, setPaidOrders] = React.useState<IOrder[]>([]);

  const addOrder = async (order: IOrder) => {
    await supabase.from("orders").insert(order);
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
