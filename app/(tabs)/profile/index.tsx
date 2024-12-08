import { useAuth } from "@/context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  if (!user) return <></>;

  return (
    <SafeAreaView style={{ paddingTop: headerHeight, height: "100%" }}>
      <View>
        <View className="flex flex-col items-center justify-center gap-2">
          <Avatar.Image
            accessibilityLabel="avatar"
            size={100}
            source={{
              uri: "https://cdn-icons-png.freepik.com/256/12165/12165042.png?ga=GA1.1.492447503.1733309013&semt=ais_hybrid",
            }}
          />

          <Text className="font-bold text-2xl">
            {user.name} {user.last_name}
          </Text>
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

      <Text className="text-muted-foreground opacity-40  mt-48 mx-auto ">
        Logueado
        {/* {session.user.email} */}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 2.15.1
      </Text>

      <View className="absolute bottom-[100px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-yellow-400 shadow-lg" />

      <View className="absolute bottom-[50px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-40deg] bg-orange-500 shadow-lg" />

      <View className="absolute bottom-[10px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-black shadow-lg" />
    </SafeAreaView>
  );
}
