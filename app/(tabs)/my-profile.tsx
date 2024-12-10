import { useAuth } from "@/context";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
  const { profile: user, signOut, session } = useAuth();
  return (
    <SafeAreaView className="bg-white p-4 h-screen-safe">
      <View className="flex flex-col items-center gap-4">
        <Avatar.Image
          accessibilityLabel="avatar"
          size={100}
          source={{
            uri: user.image_url,
          }}
        />

        <View className="flex flex-col gap-1">
          <Text className="font-bold text-2xl">
            {user.name} {user.last_name}
          </Text>

          <Text className="text-md">
            {user.role === "chef"
              ? "Cocinero"
              : user.role === "admin"
              ? "Administrador"
              : "Mesero"}
          </Text>
        </View>
        <Button onPress={signOut} icon="logout" mode="contained">
          Cerrar Sesión
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-20 mx-auto text-sm">
        Logueado
        {/* con {session?.user.email} */}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 3.15.1
      </Text>

      <View className="absolute bottom-[80px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-yellow-400 shadow-lg" />

      <View className="absolute bottom-[40px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-40deg] bg-orange-500 shadow-lg" />

      <View className="absolute bottom-[0px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-black shadow-lg" />
    </SafeAreaView>
  );
}
