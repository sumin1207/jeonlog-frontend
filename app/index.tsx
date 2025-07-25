import { useRouter } from "expo-router";
import { View, Text, SafeAreaView, Image } from "react-native";
import NaverLoginButton from "../components/NaverLoginButton";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();

  const backgroundColor = "#1c3519";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor }}>
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Image
            source={require("../assets/images/mainIcon.png")}
            style={{
              width: 200,
              height: 200,
              marginBottom: 16,
              borderRadius: 0,
              backgroundColor: "transparent",
            }}
            resizeMode='contain'
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 5,
            textAlign: "center",
            color: "#fff",
          }}>
          간편로그인
        </Text>
        <NaverLoginButton
          onSuccess={() => router.replace("/onboarding/category")}
        />
        <GoogleLoginButton
          onSuccess={() => router.replace("/onboarding/category")}
        />
      </View>
    </SafeAreaView>
  );
}
