import { useAuth } from "@/context";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { session } = useAuth();

  if (session) {
    <Redirect href="/(tabs)" />;
  } else {
    <Redirect href="/(auth)/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
