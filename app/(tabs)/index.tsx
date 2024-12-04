import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { View, ScrollView, Pressable } from "react-native";
import { Surface, Text, Portal, Modal, Button } from "react-native-paper";
import { Svg, Rect, Circle, Text as SvgText } from "react-native-svg";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface TableProps {
  number: number;
  status: boolean;
  onPress: () => void;
}

interface ITable {
  id: number;
  status: boolean;
}

const TableSvg: React.FC<TableProps> = ({ number, status }) => {
  const getColor = () => {
    switch (status) {
      case true:
        return "#4CAF50";
      case false:
        return "#F44336";
      default:
        return "#4CAF50";
    }
  };

  return (
    <Svg height="120" width="120" viewBox="0 0 120 120">
      <Rect
        x="20"
        y="20"
        width="80"
        height="80"
        fill="white"
        stroke={getColor()}
        strokeWidth="3"
        rx="10"
      />
      <Circle cx="60" cy="35" r="8" fill={getColor()} />
      <Circle cx="60" cy="85" r="8" fill={getColor()} />
      <Circle cx="35" cy="60" r="8" fill={getColor()} />
      <Circle cx="85" cy="60" r="8" fill={getColor()} />
      <SvgText
        x="60"
        y="65"
        fontSize="20"
        textAnchor="middle"
        fill={getColor()}
      >
        {number}
      </SvgText>
    </Svg>
  );
};

export default function TablesScreen() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tables, setTables] = useState<ITable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tables")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setTables(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching tables");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();

    const channel = supabase
      .channel("table-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
        },
        () => {
          fetchTables();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleTablePress = (tableId: number) => {
    setSelectedTable(tableId);
  };

  const closeModal = () => setSelectedTable(null);

  const updateTableStatus = async (status: boolean) => {
    try {
      const { error } = await supabase
        .from("tables")
        .update({ status })
        .eq("id", selectedTable);

      if (error) throw error;

      // Actualizar el estado local inmediatamente
      setTables(
        tables.map((table) =>
          table.id === selectedTable ? { ...table, status } : table
        )
      );

      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating table");
    }
  };

  const getSelectedTableNumber = () => {
    const selectedTableData = tables.find(
      (table) => table.id === selectedTable
    );
    return selectedTableData?.id || "";
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!tables.length) return <Text>No se encontraron</Text>;

  return (
    <SafeAreaView className="p-4 ">
      <Text className="text-4xl" style={{ fontWeight: "700" }}>
        Mesas
      </Text>
      <Text className="opacity-50">Listado de mesas del restaurant</Text>
      <Divider style={{ marginTop: 16 }} />

      <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
        <View className="flex-row flex-wrap justify-between items-center gap-4">
          {tables.map((table) => (
            <Pressable
              key={table.id}
              onPress={() => handleTablePress(table.id)}
              className="p-2"
            >
              <Surface className="rounded-lg elevation-4 p-2">
                <TableSvg
                  number={table.id}
                  status={table.status}
                  onPress={() => handleTablePress(table.id)}
                />
              </Surface>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Portal>
        <Modal visible={selectedTable !== null} onDismiss={closeModal}>
          <View className="p-4 bg-white mx-4 my-8 rounded-lg">
            <Text className="text-xl font-bold mb-4 text-center">
              Mesa N°{getSelectedTableNumber()}
            </Text>
            <View className="gap-2">
              <Button mode="outlined" onPress={() => updateTableStatus(true)}>
                <Text>Disponible</Text>
              </Button>
              <Button mode="outlined" onPress={() => updateTableStatus(false)}>
                <Text>Ocupado</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}
