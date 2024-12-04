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
  getPaidOrders: () => Promise<IOrder[]>;
  getOrderById: (id: string) => Promise<IOrder>;
  orders: IOrder[];
  order: IOrder;
  deleteOrder: (id: string) => Promise<void>;
  getOrders: () => Promise<IOrder[]>;
}
