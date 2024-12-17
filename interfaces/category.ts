export interface ICategory {
  id?: string;
  name: string;
  created_at?: Date;
  id_tenant?: string;
}

export interface ICategoryContextProvider {
  addCategory: (category: ICategory) => Promise<void>;
  getCategoryById: (id: string) => Promise<ICategory>;
  getCategories: (
    id_tenant: string
  ) => Promise<ICategory[] | any[] | undefined>;
  categories: ICategory[];
  category: ICategory;
  loading: boolean;
  deleteCategory: (id: string) => Promise<void>;
}