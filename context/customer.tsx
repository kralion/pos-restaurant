import { ICustomer, ICustomerContextProvider } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const CustomerContext = createContext<ICustomerContextProvider>({
  customer: {} as ICustomer,
  customers: [],
  deleteCustomer: async () => {},
  getCustomers: async () => {},
  loading: false,
  getCustomerById: async () => {},
});

export function CustomerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [customer, setCustomer] = useState<ICustomer>({} as ICustomer);

  const getCustomerById = async (id: string) => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setCustomer(data);
        return data;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Profile Fetch Error", error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from("fixed_customers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (err: any) {
      alert("Error deleting customer: " + err.message);
    }
  };

  const getCustomers = async () => {
    const { data, error } = await supabase
      .from("fixed_customers")
      .select("*")
      .order("full_name");

    if (error) throw error;

    setCustomers(data);
    return data;
  };

  return (
    <CustomerContext.Provider
      value={{
        loading,
        customer,
        getCustomerById,
        customers,
        deleteCustomer,
        getCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within an CustomerProvider");
  }
  return context;
};
