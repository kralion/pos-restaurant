export interface IMeal {
  id: string;
  name: string;
  price: number;
  created_at?: Date;
  id_tenant: string;
  image_url: string;
  id_category: string;
  category?: string;
  quantity: number;
}

export interface IMealContextProvider {
  addMeal: (Meal: IMeal) => Promise<void>;
  getMealById: (id: string) => Promise<IMeal>;
  loading: boolean;
  getMealsByCategoryId: (id: string) => Promise<IMeal[]>;
  changeMealAvailability: (
    id: string,
    quantity: number,
    id_tenant: string
  ) => Promise<void>;
  meals: IMeal[];
  meal: IMeal;
  deleteMeal: (id: string) => Promise<void>;
  getDailyMeals: () => Promise<null | IMeal[]>;
}
