import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { useUserContext } from "@/context";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useUserContext();

  return user.role === "chef" ? (
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
        name="order"
        options={{
          title: "Orden",
          href: null,
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:pencil-3-fill.svg"
                  : "https://api.iconify.design/mingcute:pencil-3-line.svg",
              }}
              alt="google"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          href: null,
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
      <Tabs.Screen
        name="chef-order"
        options={{
          title: "Chef",
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
        name="orders"
        options={{
          title: "Ordenes",
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
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:user-2-fill.svg"
                  : "https://api.iconify.design/mingcute:user-2-line.svg",
              }}
              alt="google"
            />
          ),
        }}
      />
    </Tabs>
  ) : user.role === "admin" ? (
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
        name="order"
        options={{
          title: "Orden",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:pencil-3-fill.svg"
                  : "https://api.iconify.design/mingcute:pencil-3-line.svg",
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
      <Tabs.Screen
        name="chef-order"
        options={{
          title: "Chef",
          href: null,
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
        name="orders"
        options={{
          title: "Ordenes",
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
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:user-2-fill.svg"
                  : "https://api.iconify.design/mingcute:user-2-line.svg",
              }}
              alt="google"
            />
          ),
        }}
      />
    </Tabs>
  ) : (
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
        name="order"
        options={{
          title: "Orden",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:pencil-3-fill.svg"
                  : "https://api.iconify.design/mingcute:pencil-3-line.svg",
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
          href: null,
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
      <Tabs.Screen
        name="chef-order"
        options={{
          title: "Chef",
          href: null,
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
        name="orders"
        options={{
          title: "Ordenes",
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
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/mingcute:user-2-fill.svg"
                  : "https://api.iconify.design/mingcute:user-2-line.svg",
              }}
              alt="google"
            />
          ),
        }}
      />
    </Tabs>
  );
}
