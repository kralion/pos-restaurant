import { View, Text, ScrollView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import React from "react";

export default function HomeScreen() {
  const headerHeight = useHeaderHeight();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      style={{
        paddingTop: headerHeight,
        minHeight: "100%",
      }}
    >
      <Text>Orders</Text>
    </ScrollView>
  );
}
