import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Image } from "expo-image";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
        },
        tabBarHideOnKeyboard: true,
        freezeOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:clipboard-fill.svg"
                  : "https://api.iconify.design/mingcute:clipboard-line.svg",
              }}
              alt="google"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tables"
        options={{
          headerShown: false,
          title: "Mesas",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:album-2-fill.svg"
                  : "https://api.iconify.design/mingcute:album-2-line.svg",
              }}
              alt="google"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Pagos",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:inbox-2-fill.svg"
                  : "https://api.iconify.design/mingcute:inbox-2-line.svg",
              }}
              alt="google"
            />
          ),
        }}
      />
    </Tabs>
  );
}
