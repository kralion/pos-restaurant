import { useAuth } from "@/context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
  const { profile: user, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white p-4 h-screen-safe">
      <View className="flex flex-col items-center justify-center gap-2">
        <Image
          accessibilityLabel="avatar"
          style={{
            width: 100,
            height: 100,
          }}
          source={{
            uri: "https://img.icons8.com/?size=100&id=c2egtkdAFOMH&format=png&color=FD7E14",
          }}
        />

        <Text className="font-bold text-2xl">
          {user.name} {user.last_name}
        </Text>

        <Text className="text-md">{user.role}</Text>
      </View>

      <View className="flex flex-col gap-2 mt-10 items-start ">
        <Button
          icon="account-group-outline"
          onPress={() => router.push("/(tabs)/profile/users")}
          mode="text"
        >
          Usuarios
        </Button>
        <Button
          icon="air-filter"
          onPress={() => router.push("/(tabs)/profile/categories")}
          mode="text"
        >
          Categorías
        </Button>
        <Button
          icon="account-heart-outline"
          onPress={() => router.push("/(tabs)/profile/customers")}
          mode="text"
        >
          Clientes Fijos
        </Button>
        <Button
          onPress={() => router.push("/(tabs)/profile/daily-report")}
          mode="text"
          icon="chart-line"
        >
          Reporte Diario
        </Button>

        <Button onPress={signOut} icon="logout" mode="contained-tonal">
          Cerrar Sesión
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-36 mx-auto ">
        Logueado
        {/* {session.user.email} */}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 2.0.2-beta
      </Text>

      <View className="absolute bottom-[200px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-yellow-400 shadow-lg" />

      <View className="absolute bottom-[150px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-40deg] bg-orange-500 shadow-lg" />

      <View className="absolute bottom-[100px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-black shadow-lg" />
    </SafeAreaView>
  );
}
