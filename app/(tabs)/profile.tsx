import { useUserContext } from "@/context";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Avatar, Button, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
  const { user, setUserLogout } = useUserContext();
  const router = useRouter();

  return (
    <SafeAreaView style={{ padding: 16, height: "100%" }}>
      <View className="flex flex-col items-center gap-8">
        <View className="w-full">
          <Text className="text-4xl" style={{ fontWeight: "700" }}>
            Tu Perfil
          </Text>
          <Text className="opacity-50">Datos de la Sesión Iniciada</Text>
          <Divider style={{ marginVertical: 16 }} />
        </View>
        <View className="flex flex-col gap-8 items-center">
          <Avatar.Image
            accessibilityLabel="avatar"
            size={100}
            //TODO: Change this to the user's image
            source={{
              uri: "https://cdn-icons-png.freepik.com/256/16111/16111587.png?semt=ais_hybrid",
            }}
          />

          <View className="flex flex-col  items-center ">
            <Text className="font-bold text-2xl">
              Nombres : {`${user?.name}`}
            </Text>
            <Text className="font-bold text-2xl">
              Rol :
              {user.role === "chef"
                ? "Chef"
                : user.role === "admin"
                ? "Admin"
                : "Mozo"}
            </Text>
          </View>
        </View>
        <Button
          onPress={() => {
            setUserLogout();
            router.replace("/(auth)/login");
          }}
          icon="logout"
          mode="contained"
        >
          Cerrar Sesión
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 3.15.1
      </Text>

      <View className="absolute bottom-[50px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-orange-400 shadow-lg" />

      <View className="absolute bottom-[20px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-40deg] bg-purple-500 shadow-lg" />

      <View className="absolute bottom-[-20px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-black shadow-lg" />
    </SafeAreaView>
  );
}
