import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import useNaverLogin from "../../hooks/useNaverLogin";
import { Ionicons } from "@expo/vector-icons";

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
        <View style={styles.buttonContent}>
          <Ionicons
            name='logo-github'
            size={18}
            color='white'
          />
          <Text style={styles.text}>네이버로 로그인</Text>
        </View>
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
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NaverLoginButton;
