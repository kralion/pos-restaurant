export interface IMeal {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  id?: number;
  table: number;
  date: Date;
  waiter: string;
  status: boolean;
  paid: boolean;
  entradas: IMeal[];
  bebidas: IMeal[];
}

export interface IOrderContextProvider {
  addOrder: (Order: IOrder) => Promise<void>;
  getOrderById: (id: string) => Promise<IOrder>;
  orders: IOrder[];
  order: IOrder;
  deleteOrder: (id: string) => Promise<void>;
  getOrders: () => Promise<IOrder[]>;
}
