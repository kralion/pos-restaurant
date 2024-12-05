import { useAuth } from "@/context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
  const { user, signOut, session } = useAuth();
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  return (
    <SafeAreaView style={{ paddingTop: headerHeight, height: "100%" }}>
      <View>
        <View className="flex flex-col items-center">
          <Avatar.Image
            accessibilityLabel="avatar"
            source={{
              uri: "https://cdn-icons-png.freepik.com/256/16111/16111587.png?semt=ais_hybrid",
            }}
          />

          <View className="flex flex-col gap-1">
            <Text className="font-bold text-2xl">{`${user.name}`}</Text>
            <Button
              mode={
                user.role === "chef"
                  ? "contained"
                  : user.role === "admin"
                  ? "contained"
                  : "outlined"
              }
            >
              <Text className="text-md">{user.role}</Text>
            </Button>
          </View>
        </View>
      </View>
      <View className="flex flex-col mt-10 items-start ml-4">
        <Button
          icon="account-group"
          onPress={() => router.push("/(tabs)/profile/users")}
          mode="text"
        >
          Usuarios
        </Button>
        <Button
          onPress={() => router.push("/(tabs)/profile/daily-report")}
          mode="text"
          icon="chart-line"
        >
          Reporte Diario
        </Button>

        <Button onPress={signOut} icon="logout" mode="text">
          Salir
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-44 mx-auto text-sm">
        Logueado con
        {session.user.email}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 2.15.1
      </Text>

      <View className="absolute bottom-[100px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-yellow-400 shadow-lg" />

      <View className="absolute bottom-[50px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-40deg] bg-orange-500 shadow-lg" />

      <View className="absolute bottom-[10px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-primary shadow-lg" />
    </SafeAreaView>
  );
}
