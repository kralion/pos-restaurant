import { ITable } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Divider, Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { G, Polygon, Rect, Svg, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

function TableSvg({ table, index }: { table: ITable; index: number }) {
  const rotation = useSharedValue(90);

  useEffect(() => {
    rotation.value = withDelay(
      index * 50,
      withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value}deg` }],
    };
  });

  function onPress() {
    if (table.status) {
      router.push({
        pathname: "/add-order",
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
    <Animated.View style={animatedStyle}>
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
    </Animated.View>
  );
}

export default function TablesScreen() {
  const [tables, setTables] = useState<ITable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const getTables = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        throw error;
      }
      setTables(data || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupSubscription = useCallback(() => {
    if (channelRef.current) return;

    channelRef.current = supabase
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
  }, [getTables]);

  useFocusEffect(
    useCallback(() => {
      getTables();
      setupSubscription();

      return () => {
        if (channelRef.current) {
          channelRef.current.unsubscribe();
          channelRef.current = null;
        }
      };
    }, [getTables, setupSubscription])
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="p-4 bg-white">
      <Text className="text-4xl" style={{ fontWeight: "700" }}>
        Mesas
      </Text>
      <Text className="opacity-50">Listado de mesas del restaurant</Text>
      <Divider style={{ marginTop: 16 }} />

      <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
        <View className="flex-row flex-wrap justify-center items-center gap-14">
          {tables.map((table, index) => (
            <TableSvg key={table.id} table={table} index={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
