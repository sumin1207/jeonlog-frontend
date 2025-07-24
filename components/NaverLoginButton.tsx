import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import useNaverLogin from "../hooks/useNaverLogin";

interface NaverLoginButtonProps {
  onSuccess?: () => void;
}

const NaverLoginButton = ({ onSuccess }: NaverLoginButtonProps) => {
  const { promptAsync } = useNaverLogin();

  const handlePress = async () => {
    const result = await promptAsync();
    if (result?.type === "success" && onSuccess) {
      onSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1EC800" }]}
        onPress={handlePress}>
        <Text style={styles.text}>네이버로 로그인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  button: {
    width: "80%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NaverLoginButton;
