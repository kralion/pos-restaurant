import { ITable } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";

import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { G, Polygon, Rect, Svg, Text as SvgText } from "react-native-svg";

function TableSvg({ table }: { table: ITable }) {
  function onPress() {
    if (table.status) {
      router.replace({
        pathname: "/(modals)/add-order",
        params: { number: table.number, id_table: table.id },
      });
    } else {
      alert("La mesa está ocupada");
    }
  }
  const getStatusColor = () => {
    switch (table.status) {
      case true:
        return "#4CAF50";
      case false:
        return "#F44336";
      default:
        return "#4CAF50";
    }
  };

  return (
    // <Svg width="100" height="120" viewBox="0 0 24 24" onPress={onPress}>
    //   <SvgText
    //     x="12"
    //     y="2"
    //     fontSize="5"
    //     fontWeight="bold"
    //     textAnchor="middle"
    //     alignmentBaseline="middle"
    //   >
    //     {table.number}
    //   </SvgText>
    //   <Path
    //     d="M18.76,6l2,4H3.24l2-4H18.76M20,4H4L1,10v2H3v7H5V16H19v3h2V12h2V10L20,4ZM5,14V12H19v2Z"
    //     fill={getStatusColor()}
    //   />
    // </Svg>
    <Svg width="80" height="120" viewBox="0 0 500 500" onPress={onPress}>
      <G fill={getStatusColor()}>
        <Polygon points="407.165,84.97 104.835,84.97 0,175.997 512,175.997" />
        <Rect y="183.102" width="512" height="31.793" />
        <Rect y="222.223" width="51.203" height="204.806" />
        <Rect x="92.448" y="222.223" width="42.67" height="130.918" />
        <Rect x="460.793" y="222.223" width="51.207" height="204.806" />
        <Rect x="376.882" y="222.223" width="42.67" height="130.918" />
      </G>
      <SvgText
        x="256"
        y="30"
        fontSize="150"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {table.number}
      </SvgText>
    </Svg>
  );
}

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
        <View className="flex-row flex-wrap justify-center items-center gap-14">
          {tables.map((table) => (
            <TableSvg key={table.id} table={table} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
