import React from "react";
import { View, Text } from "react-native";
import SocialLoginButton from "@/components/SocialLoginButton";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, textAlign: "center" }}>전:록</Text>
      <SocialLoginButton />
    </View>
  );
}
