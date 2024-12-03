import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase";
import { IOrder, IOrderContextProvider } from "@/interfaces";

export const OrderContext = createContext<IOrderContextProvider>({
  addOrder: async () => {},
  getOrderById: async (id: string): Promise<IOrder> => ({} as IOrder),
  orders: [],
  order: {} as IOrder,
  deleteOrder: async () => {},
  getOrders: async () => [],
});

export const OrderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [order, setOrder] = React.useState<IOrder>({} as IOrder);

  const addOrder = async (order: IOrder) => {
    await supabase.from("orders").insert(order);
  };

  const getOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) throw error;
    setOrders(data);
    return data;
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;
    console.log("Order deleted", error);
  };

  async function getOrderById(id: string) {
    const { data, error } = await supabase
      .from("Orders")
      .select("*")
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
        addOrder,
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
