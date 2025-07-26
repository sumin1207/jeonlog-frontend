import { useRouter } from "expo-router";
import { View, Text, SafeAreaView, Image, Button } from "react-native";
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
