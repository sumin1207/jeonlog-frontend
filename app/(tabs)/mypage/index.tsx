import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { SocialLoginButtons } from "../../../components/auth";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";
import { Text, Button, Container, Row, Column } from "../../../design-system";
import { MyPageStyles } from "../../../design-system/styles";
import { Colors } from "../../../design-system/theme";
import FollowModal from "../../../components/ui/FollowModal";

export default function MyPageScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    isLoggedIn,
    setIsLoggedIn,
    logout,
    userInfo,
    setUserInfo,
    isLoading,
  } = useAuth();
  const { myLogs } = useExhibition();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [showFollowModal, setShowFollowModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadExtendedProfile = async () => {
        if (userInfo) {
          const key = `user_profile_extended_${userInfo.id}`;
          const savedProfileJson = await AsyncStorage.getItem(key);
          if (savedProfileJson) {
            const savedProfile = JSON.parse(savedProfileJson);
            setBio(savedProfile.bio || "");
            setAvatar(savedProfile.avatar || null);
          } else {
            setBio("안녕하세요 저는 전린이입니다.");
            setAvatar(null);
          }
        }
      };
      loadExtendedProfile();
    }, [userInfo])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const handleTestLogin = () => {
    const testUser = {
      id: "test-user-01",
      name: "테스트 유저",
      email: "test@example.com",
      loginType: "google" as const,
    };
    setUserInfo(testUser);
  };

  const handleLoginSuccess = () => {
    console.log("🎉 로그인 성공! 홈으로 이동합니다.");
    router.replace("/(tabs)/home");
  };

  if (!userInfo) {
    return (
      <Container style={MyPageStyles.container}>
        <View style={MyPageStyles.header}>
          <Text variant='h3'>마이페이지</Text>
        </View>
        <View style={MyPageStyles.loginRequiredContainer}>
          <Ionicons
            name='person-circle-outline'
            size={80}
            color='#ccc'
          />
          <Text variant='h2'>로그인이 필요합니다</Text>
          <Text variant='body'>마이페이지를 이용하려면 로그인해주세요</Text>

          {/* 인라인 소셜 로그인 버튼들 */}
          <View style={{ marginTop: 30, width: "100%", alignItems: "center" }}>
            <SocialLoginButtons onSuccess={handleLoginSuccess} />
          </View>
        </View>
      </Container>
    );
  }

  console.log("🔍 MyPage: 로그인된 사용자 정보 표시 - userInfo:", userInfo);

  return (
    <Container style={MyPageStyles.container}>
      <View style={MyPageStyles.header}>
        <Text variant='h3'>마이페이지</Text>
        <Row style={MyPageStyles.headerIcons}>
          <TouchableOpacity style={MyPageStyles.topButton}>
            <Ionicons
              name='notifications-outline'
              size={28}
              color='#000'
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={MyPageStyles.topButton}
            onPress={() => router.push("/mypage/setting")}>
            <Ionicons
              name='settings-outline'
              size={28}
              color='#000'
            />
          </TouchableOpacity>
        </Row>
      </View>

      <ScrollView style={MyPageStyles.scrollView}>
        <Row style={MyPageStyles.profileSection}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={MyPageStyles.avatar}
            />
          ) : (
            <View style={MyPageStyles.avatar}>
              <Ionicons
                name='person'
                size={40}
                color='#666'
              />
            </View>
          )}
          <Column style={MyPageStyles.profileInfo}>
            <Text variant='bold'>
              {userInfo?.name ?? "전린이's 전시라이프"}
            </Text>
            <Text variant='caption'>{bio}</Text>
          </Column>
        </Row>

        <Row style={MyPageStyles.buttonsSection}>
          <Row style={MyPageStyles.mainButtonsWrapper}>
            <Button
              title='프로필 수정'
              onPress={() => router.push("/(tabs)/mypage/edit-profile")}
              variant='secondary'
              size='small'
              style={{
                flex: 1,
                paddingVertical: 6,
                backgroundColor: Colors.neutral.gray200,
                borderWidth: 0,
              }}
              textStyle={{
                color: Colors.text.primary,
              }}
            />
            <Button
              title='북마크한 전시'
              onPress={() =>
                router.push("/(tabs)/mypage/exhibition/Bookmarked")
              }
              variant='secondary'
              size='small'
              style={{
                flex: 1,
                marginLeft: 8,
                paddingVertical: 6,
                backgroundColor: Colors.neutral.gray200,
                borderWidth: 0,
              }}
              textStyle={{
                color: Colors.text.primary,
              }}
            />
          </Row>
          <TouchableOpacity
            style={MyPageStyles.iconButton}
            onPress={() => setShowFollowModal(true)}>
            <Ionicons
              name='person-outline'
              size={16}
              color='#000'
            />
          </TouchableOpacity>
        </Row>

        <View style={MyPageStyles.divider} />

        <Column style={MyPageStyles.logsSection}>
          <Text variant='bodySmall'>나의 전시 기록들 ({myLogs.length})</Text>
          <Row
            style={MyPageStyles.recordsGrid}
            wrap>
            {myLogs.length > 0 ? (
              myLogs.map((log) => {
                const exhibitionId = log.exhibitionId || log.id;
                const exhibition =
                  exhibitionData[exhibitionId as keyof typeof exhibitionData];

                if (!exhibition) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    key={log.id}
                    style={MyPageStyles.logCard}
                    onPress={() => {
                      router.push(`/exhibition-log/${log.id}?from=mypage`);
                    }}>
                    <Image
                      source={
                        log.mainImage
                          ? { uri: log.mainImage }
                          : exhibition.image
                      }
                      style={MyPageStyles.logImage}
                    />
                    <Text
                      variant='caption'
                      align='center'
                      style={MyPageStyles.logTitle}>
                      {exhibition.title}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Column style={MyPageStyles.emptyRecords}>
                <Text
                  variant='body'
                  color='secondary'>
                  작성한 전시 기록이 없습니다
                </Text>
              </Column>
            )}
          </Row>
        </Column>
      </ScrollView>

      <FollowModal
        visible={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        userName={userInfo?.name}
      />
    </Container>
  );
}
