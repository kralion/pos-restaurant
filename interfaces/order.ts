import { ICustomer, IMeal, IUser } from "@/interfaces";

export interface IOrder {
  id?: string;
  id_table: string;
  date?: Date;
  users?: IUser;
  customers?: ICustomer;
  id_fixed_customer?: string | null;
  id_waiter: string;
  free?: boolean;
  served: boolean;
  to_go: boolean;
  paid: boolean;
  entradas: IMeal[];
  fondos: IMeal[];
  bebidas: IMeal[];
  helados: IMeal[];
  total: number;
}

export interface IOrderContextProvider {
  addOrder: (order: IOrder, tableId: string) => Promise<void>;
  updateOrderServedStatus: (id: string) => Promise<void>;
  getUnservedOrders: () => Promise<IOrder[]>;
  getPaidOrders: () => Promise<IOrder[]>;
  loading: boolean;
  updateOrder: (order: IOrder) => Promise<void>;
  getOrderById: (id: string) => Promise<IOrder>;
  orders: IOrder[];
  order: IOrder;
  paidOrders: IOrder[];
  deleteOrder: (id: string) => Promise<void>;
  getOrders: () => Promise<IOrder[]>;
  getDailyPaidOrders: () => Promise<IOrder[]>;
  getUnpaidOrders: () => Promise<IOrder[]>;
}
