import { AuthContextProvider, OrderContextProvider, useAuth } from "@/context";
import { MealContextProvider } from "@/context/meals";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-reanimated";
import "../styles/global.css";
// Import your global CSS file

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthContextProvider>
      <PaperProvider theme={theme}>
        <OrderContextProvider>
          <MealContextProvider>
            <Stack>
              <Stack.Screen
                name="sign-in"
                options={{
                  title: "Iniciar Sesión",
                  headerShown: false,
                }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(modals)/add-order"
                options={{
                  title: "Agregar Orden",
                  headerBackTitle: "Menú",
                  headerLargeTitle: true,

                  headerShadowVisible: false,
                  headerLargeTitleShadowVisible: false,
                }}
              />
            </Stack>
          </MealContextProvider>
        </OrderContextProvider>
      </PaperProvider>
    </AuthContextProvider>
  );
}
