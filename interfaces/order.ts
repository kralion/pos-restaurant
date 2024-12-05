import { IUser } from "./user";

export interface IMeal {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  id?: string;
  table: number;
  date: Date;
  users?: IUser;
  id_waiter: string;
  served: boolean;
  paid: boolean;
  entradas: IMeal[];
  fondos: IMeal[];
  bebidas: IMeal[];
}

export interface IOrderContextProvider {
  addOrder: (Order: IOrder) => Promise<void>;
  updateOrderServedStatus: (id: string) => Promise<void>;
  getUnservedOrders: () => Promise<IOrder[]>;
  getPaidOrders: () => Promise<IOrder[]>;
  getOrderById: (id: string) => Promise<IOrder>;
  orders: IOrder[];
  order: IOrder;
  paidOrders: IOrder[];
  deleteOrder: (id: string) => Promise<void>;
  getOrders: () => Promise<IOrder[]>;
  addOrderAndUpdateTable: (order: IOrder, selectedTable: string) => Promise<{ success: boolean; error?: any }>;
}
