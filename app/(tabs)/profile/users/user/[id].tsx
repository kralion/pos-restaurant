import { View, Text, Button } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function SingleUserScreen() {
  return (
    <View>
      <Text>SingleUserScreen</Text>
      <Button title="Atras" onPress={() => router.back()} />
    </View>
  );
}
