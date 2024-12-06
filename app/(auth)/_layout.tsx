import { useAuth } from "@/context";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
