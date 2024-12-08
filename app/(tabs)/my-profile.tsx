import { useAuth } from "@/context";
import { View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ProfileScreen() {
  const { user, signOut, session } = useAuth();

  return (
    <SafeAreaView style={{ paddingTop: 16, height: "100%" }}>
      <View className="flex flex-col items-center gap-4">
        <Avatar.Image
          accessibilityLabel="avatar"
          size={150}
          source={{
            uri: "https://cdn-icons-png.freepik.com/256/16111/16111587.png?semt=ais_hybrid",
          }}
        />

        <View className="flex flex-col gap-1">
          <Text className="font-bold text-2xl">{`${
            user.name || "Jhons"
          }`}</Text>
          <Button
            mode={
              user.role === "chef"
                ? "contained"
                : user.role === "admin"
                ? "contained"
                : "outlined"
            }
          >
            <Text className="text-md">{user.role || "Chef"}</Text>
          </Button>
        </View>
        <Button onPress={signOut} icon="logout" mode="contained">
          Salir
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-44 mx-auto text-sm">
        Logueado
        {/* {session.user.email} */}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 2.15.1
      </Text>

      <View className="absolute bottom-[80px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-yellow-400 shadow-lg" />

      <View className="absolute bottom-[40px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-40deg] bg-orange-500 shadow-lg" />

      <View className="absolute bottom-[0px] right-[-70px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-black shadow-lg" />
    </SafeAreaView>
  );
}
