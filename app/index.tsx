import { useRouter } from "expo-router";
import { View, Text, SafeAreaView, Image } from "react-native";
import NaverLoginButton from "../components/NaverLoginButton";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();

  // 브랜드 컬러로 배경 고정
  const backgroundColor = "#1a2e1a";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View style={{ flex: 1, justifyContent: "center", backgroundColor }}>
        {/* 로고와 앱 이름 */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Image
            source={require("../assets/images/icon.jpg")}
            style={{ width: 80, height: 80, marginBottom: 16 }}
            resizeMode='contain'
          />
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff" }}>
            전:록
          </Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
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
