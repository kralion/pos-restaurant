import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Divider, Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, Rect, Svg, Text as SvgText } from "react-native-svg";

interface ITable {
  id: number;
  number: number;
  status: boolean;
}

const TableSvg: React.FC<ITable> = ({ number, status }) => {
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
  const [tables, setTables] = useState<ITable[]>([]);

  async function getTables() {
    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    setTables(data);
  }

  useEffect(() => {
    getTables();
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
          getTables();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

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
              onPress={() => {
                if (table.status) {
                  router.push({
                    pathname: "/(tabs)/order",
                    params: { number: table.number },
                  });
                } else {
                  alert("La mesa está ocupada");
                }
              }}
              className="p-2"
            >
              <Surface className="rounded-lg elevation-4 p-2">
                <TableSvg
                  number={table.id}
                  status={table.status}
                  id={table.id}
                />
              </Surface>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
