import React from "react";
import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, ThemeType } from "../../../contexts/ThemeContext";
import { useExhibition } from "../../../contexts/ExhibitionContext";
import { useAuth } from "../../../components/context/AuthContext";
import { exhibitionData } from "../../../data/exhibitionsDataStorage";
import { Text, Button, Container, Row, Column } from "../../../design-system";
import { MyPageStyles } from "../../../design-system/styles";

export default function MyPageScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn, logout, userInfo, isLoading } = useAuth();
  const { myLogs } = useExhibition();

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

  // 로그인 api 연동되면 나중에 수정
  // if (!isLoggedIn || !userInfo) {
  //   console.log(
  //     "🔍 MyPage: 로그인 필요 - isLoggedIn:",
  //     isLoggedIn,
  //     "userInfo:",
  //     userInfo
  //   );
  //   return (
  //     <Container style={MyPageStyles.container}>
  //       <View style={MyPageStyles.header}>
  //         <Text variant="h3">마이페이지</Text>
  //       </View>
  //       <View style={MyPageStyles.loginRequiredContainer}>
  //         <Ionicons
  //           name='person-circle-outline'
  //           size={80}
  //           color='#ccc'
  //         />
  //         <Text variant="h2">로그인이 필요합니다</Text>
  //         <Text variant="body">
  //           마이페이지를 이용하려면 로그인해주세요
  //         </Text>
  //         <Button
  //           title="로그인 하러가기"
  //           onPress={() => router.push("/")}
  //           variant="primary"
  //         />
  //       </View>
  //     </Container>
  //   );
  // }

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
          <View style={MyPageStyles.avatar}>
            <Ionicons
              name='person'
              size={40}
              color='#666'
            />
          </View>
          <Column style={MyPageStyles.profileInfo}>
            <Text variant='h4'>{userInfo?.name ?? "석준's 전시라이프"}</Text>
            <Text variant='caption'>안녕하세요 저는 전린이입니다.</Text>
          </Column>
        </Row>

        <Row style={MyPageStyles.buttonsSection}>
          <Row style={MyPageStyles.mainButtonsWrapper}>
            <Button
              title='프로필 수정'
              onPress={() => {}}
              variant='secondary'
              style={{ flex: 1 }}
            />
            <Button
              title='저장한 전시'
              onPress={() =>
                router.push("/(tabs)/mypage/exhibition/Bookmarked")
              }
              variant='secondary'
              style={{ flex: 1, marginLeft: 10 }}
            />
          </Row>
          <TouchableOpacity style={MyPageStyles.iconButton}>
            <Ionicons
              name='person-outline'
              size={19}
              color='#000'
            />
          </TouchableOpacity>
        </Row>

        <View style={MyPageStyles.divider} />

        <Column style={MyPageStyles.logsSection}>
          <Text variant='h4'>나의 전시 기록들 ({myLogs.length})</Text>
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
                      source={exhibition.image}
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
    </Container>
  );
}
