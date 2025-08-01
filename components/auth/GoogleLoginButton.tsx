import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import useGoogleLogin from "@/hooks/useGoogleLogin";
import { Ionicons } from "@expo/vector-icons";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

const GoogleLoginButton = ({ onSuccess }: GoogleLoginButtonProps) => {
  const { promptAsync } = useGoogleLogin();

  const handlePress = async () => {
    const result = await promptAsync();
    if (result?.type === "success" && onSuccess) {
      onSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}>
        <View style={styles.buttonContent}>
          <Ionicons
            name='logo-google'
            size={18}
            color='white'
          />
          <Text style={styles.text}>구글로 로그인</Text>
        </View>
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

export default GoogleLoginButton;
