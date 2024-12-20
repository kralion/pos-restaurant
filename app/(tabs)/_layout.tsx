import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context";
import { Image } from "expo-image";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { profile: user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const tabConfigurations = {
    chef: [
      {
        name: "index",
        title: "Mesas",
        icon: ["mingcute:album-2-fill.svg", "mingcute:album-2-line.svg"],
      },
      {
        name: "menu",
        title: "Menú",
        icon: ["mingcute:hamburger-fill.svg", "mingcute:hamburger-line.svg"],
      },
      {
        name: "payments",
        title: "Pagos",
        href: null,
        icon: ["mingcute:inbox-2-fill.svg", "mingcute:inbox-2-line.svg"],
      },
      {
        name: "chef-order",
        title: "Ordenes",
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "my-profile",
        title: "Mi Perfil",
        icon: ["mingcute:user-2-fill.svg", "mingcute:user-2-line.svg"],
      },
      {
        name: "orders",
        title: "Ordenes",
        href: null,
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "profile",
        title: "Mi Perfil",
        href: null,
        icon: ["mingcute:user-2-fill.svg", "mingcute:user-2-line.svg"],
      },
    ],
    admin: [
      {
        name: "index",
        title: "Mesas",
        icon: ["mingcute:album-2-fill.svg", "mingcute:album-2-line.svg"],
      },
      {
        name: "menu",
        title: "Menú",
        icon: ["mingcute:hamburger-fill.svg", "mingcute:hamburger-line.svg"],
      },
      {
        name: "payments",
        title: "Pagos",
        icon: ["mingcute:inbox-2-fill.svg", "mingcute:inbox-2-line.svg"],
      },
      {
        name: "chef-order",
        title: "Chef",
        href: null,
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "orders",
        title: "Ordenes",
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "my-profile",
        title: "Mi Perfil",
        href: null,
        icon: ["mingcute:user-2-fill.svg", "mingcute:user-2-line.svg"],
      },
      {
        name: "profile",
        title: "Mi Perfil",
        icon: ["mingcute:user-2-fill.svg", "mingcute:user-2-line.svg"],
      },
    ],
    waiter: [
      {
        name: "index",
        title: "Mesas",
        icon: ["mingcute:album-2-fill.svg", "mingcute:album-2-line.svg"],
      },
      {
        name: "orders",
        title: "Ordenes",
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "my-profile",
        title: "Mi Perfil",
        icon: ["mingcute:user-2-fill.svg", "mingcute:user-2-line.svg"],
      },
      {
        name: "menu",
        title: "Menú",
        href: null,
        icon: ["mingcute:hamburger-fill.svg", "mingcute:hamburger-line.svg"],
      },
      {
        name: "payments",
        title: "Pagos",
        href: null,
        icon: ["mingcute:inbox-2-fill.svg", "mingcute:inbox-2-line.svg"],
      },
      {
        name: "chef-order",
        title: "Chef",
        href: null,
        icon: ["mingcute:clipboard-fill.svg", "mingcute:clipboard-line.svg"],
      },
      {
        name: "profile",
        title: "Mi Perfil",
        href: null,
        icon: ["mingcute:user-2-fill.svg", "mingcute:user-2-line.svg"],
      },
    ],
  };

  const commonScreenOptions = {
    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
    headerShown: false,
    tabBarStyle: {
      height: 80,
      paddingTop: 10,
    },
    tabBarHideOnKeyboard: true,
    freezeOnBlur: true,
  };

  // Function to create tab icon
  const createTabIcon = (focusedIcon: string, unfocusedIcon: string) => {
    return ({ color, focused }: { color: string; focused: boolean }) => (
      <Image
        style={{ width: 28, height: 28, tintColor: color }}
        source={{
          uri: focused ? focusedIcon : unfocusedIcon,
        }}
        alt="icon"
      />
    );
  };

  const tabs =
    tabConfigurations[user.role as keyof typeof tabConfigurations] || [];

  if (tabs.length === 0) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs screenOptions={commonScreenOptions}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            href: tab.href,
            tabBarIcon: createTabIcon(
              `https://api.iconify.design/${tab.icon[0]}`,
              `https://api.iconify.design/${tab.icon[1]}`
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
