import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import useGoogleLogin from "@/hooks/useGoogleLogin";

const GoogleLoginButton = () => {
  const { promptAsync } = useGoogleLogin();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => promptAsync()}>
        <Text style={styles.text}>구글로 로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  button: {
    backgroundColor: "#4285F4",
    padding: 12,
    width: "80%",
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GoogleLoginButton;
