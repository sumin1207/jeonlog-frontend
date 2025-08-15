import { useRouter } from "expo-router";
import { View, Text, SafeAreaView, Image, Button } from "react-native";
import { useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";
import NaverLoginButton from "../components/auth/NaverLoginButton";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  const backgroundColor = "#1c3519";

  // 이미 로그인된 사용자는 홈화면으로 자동 리다이렉트
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      console.log("🔍 이미 로그인된 사용자입니다. 홈화면으로 이동합니다.");
      router.replace("/(tabs)/home");
    }
  }, [isLoggedIn, isLoading, router]);

  const handleLoginSuccess = () => {
    console.log("🎉 로그인 성공! 홈화면으로 이동합니다.");
    // 로그인 성공 시 홈화면으로 리다이렉트
    router.replace("/(tabs)/home");
  };

  // 로딩 중이거나 이미 로그인된 경우 로딩 화면 표시
  if (isLoading || isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 18 }}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <NaverLoginButton onSuccess={handleLoginSuccess} />
        <GoogleLoginButton onSuccess={handleLoginSuccess} />
        {/* 개발용: 홈으로 바로 이동 버튼 */}
        <Button
          title='개발용: 홈으로 이동'
          color='#841584'
          onPress={() => router.replace("/(tabs)/home")}
        />
        {/* 개발용: 온보딩 카테고리로 바로 이동 버튼 */}
        <Button
          title='개발용: 온보딩 카테고리로 이동'
          color='#FF6B35'
          onPress={() => router.replace("/onboarding/category")}
        />
      </View>
    </SafeAreaView>
  );
}
