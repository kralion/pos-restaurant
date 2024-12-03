import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { View, ScrollView, Pressable } from "react-native";
import { Surface, Text, Portal, Modal, Button } from "react-native-paper";
import { Svg, Rect, Circle } from "react-native-svg";

interface TableProps {
  number: number;
  status: boolean;
  onPress: () => void;
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
      {/* Mesa rectangular */}
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
      {/* Sillas */}
      <Circle cx="60" cy="35" r="8" fill={getColor()} />
      <Circle cx="60" cy="85" r="8" fill={getColor()} />
      <Circle cx="35" cy="60" r="8" fill={getColor()} />
      <Circle cx="85" cy="60" r="8" fill={getColor()} />
      {/* Número de mesa */}
    </Svg>
  );
};

const Tables = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tables, setTables] = useState(
    Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      status: true,
    }))
  );

  const handleTablePress = (tableId: number) => {
    setSelectedTable(tableId);
  };

  const closeModal = () => setSelectedTable(null);

  const updateTableStatus = (status: boolean) => {
    setTables(
      tables.map((table) =>
        table.id === selectedTable ? { ...table, status } : table
      )
    );
    closeModal();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <View className="flex-row flex-wrap justify-center items-center gap-4">
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
              Mesa N°{selectedTable}
            </Text>
            <View className="gap-2">
              <Button mode="outlined" onPress={() => updateTableStatus(true)}>
                Disponible
              </Button>
              <Button mode="outlined" onPress={() => updateTableStatus(false)}>
                Ocupado
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default Tables;
