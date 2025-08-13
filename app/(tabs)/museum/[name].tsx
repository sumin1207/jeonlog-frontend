import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "@/components/ui/TopBar";
import { NaverMap } from "@/components/ui";
import { useTheme } from "@/contexts/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

export default function MuseumDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  // 박물관/미술관 데이터 (나중에 props나 context로 전달받을 수 있음)
  const museumData = {
    국립중앙박물관: {
      name: "국립중앙박물관",
      headerImage: require("../../../assets/images/museumBackground/bg1.jpg"),
      museumEmblem: require("../../../assets/images/museumEmblem/logo1.png"),
      address: "04383 서울시 용산구 서빙고로 137(용산동6가 168-6)",
      latitude: 37.524058,
      longitude: 126.980455,
      phone: "02)2077-9000",
      website: "www.museum.go.kr",
      hours:
        "월, 화, 목, 금, 일요일: 10:00 - 18:00 (입장 마감: 17:30)\n수, 토요일: 10:00 - 21:00 (입장 마감: 20:30)\n옥외 전시장(정원): 7:00 - 22:00",
      closedDays:
        "휴관일: 1월1일, 설날(1.29.), 추석(10.6.)\n상설전시관 정기휴실일: 매년 4월, 11월(첫째 월요일)\n상설전시관 내 특별전시실 2 휴실\n특별전시실 1(특별전시 미운영시 휴실),\n야외전시장은 정상 개관\n2025년 휴실일: 4.7.(월), 11.3.(월)",
      entrance:
        "무료(상설전시관, 어린이박물관, 무료 특별전시 해당) /\n유료(유료 특별전시 해당)\n\n관람권 구입하는 곳: 특별전시실 1 앞 매표소\n관람권 판매시간: 관람 종료 30분 전까지",
      description:
        "관람시 주의하는 곳: 특별전시실 내 영상촬영 금지\n관람시 편의시설: 관람 촬영 30분 전까지",
      parking: "400번, 502번",
      parkingFee:
        "승용차(15인승 이하)기준 기본요금 2000원, 매 30분당 500원(1일최대 10,000원)",
      exhibitions: [
        {
          id: "1",
          title: "일본미술, 네 가지 시선",
          date: "2025.06.17 - 2025.08.10",
          image: require("../../../assets/images/exhibitionPoster/exhibition1.png"),
        },
        {
          id: "5",
          title: "한국미술 100년",
          date: "2024.04.01 - 2024.06.30",
          image: require("../../../assets/images/exhibitionPoster/exhibition1.png"),
        },
      ],
      subway:
        "4호선\n경의중앙선(문산-용문)\n이촌역 2번 출구 방향 '박물관 나들길' <=> '박물관 서문'\n이촌역 2번출구 <=> 박물관 서문",
    },
    "DDP 뮤지엄": {
      name: "DDP 뮤지엄",
      headerImage: require("../../../assets/images/exhibitionPoster/exhibition2.png"),
      museumEmblem: undefined,
      address: "서울 중구 을지로 281",
      latitude: 37.566535,
      longitude: 127.009422,
      phone: "02-325-1077",
      website: "www.ddpmuseum.com",
      hours: "매일 10:00-19:00 (월요일 휴관)",
      entrance: "일반 15,000원, 학생 12,000원",
      closedDays: undefined,
      description:
        "동대문디자인플라자 내에 위치한 현대적인 뮤지엄으로, 디자인과 예술의 경계를 넘나드는 혁신적인 전시를 선보입니다.",
      parking: undefined,
      parkingFee: undefined,
      subway: undefined,
      exhibitions: [
        {
          id: "2",
          title: "톰 삭스 전",
          date: "2025.08.01 - 2025.09.30",
          image: require("../../../assets/images/exhibitionPoster/exhibition2.png"),
        },
        {
          id: "6",
          title: "디자인 특별전",
          date: "2025.10.01 - 2025.12.31",
          image: require("../../../assets/images/exhibitionPoster/exhibition1.png"),
        },
      ],
    },
    MMCA: {
      name: "국립현대미술관",
      headerImage: require("../../../assets/images/exhibitionPoster/exhibition7.png"),
      museumEmblem: undefined,
      address: "서울특별시 종로구 삼청로 30",
      latitude: 37.586316,
      longitude: 126.983011,
      phone: "02-3456-7890",
      website: "www.mmca.go.kr",
      hours: "화~일 10:00-18:00 (월요일 휴관)",
      entrance: "일반 4,000원, 학생 2,000원",
      closedDays: undefined,
      description:
        "한국 현대미술의 메카로, 국내외 현대미술 작품을 수집·연구·전시하며 한국 현대미술의 발전에 기여하고 있습니다.",
      parking: undefined,
      parkingFee: undefined,
      subway: undefined,
      exhibitions: [
        {
          id: "4",
          title: "현대미술 특별전",
          date: "2024.01.20 - 2024.05.20",
          image: require("../../../assets/images/exhibitionPoster/exhibition1.png"),
        },
        {
          id: "7",
          title: "현대조각전",
          date: "2025.03.01 - 2025.06.30",
          image: require("../../../assets/images/exhibitionPoster/exhibition1.png"),
        },
      ],
    },
    서울시립미술관: {
      name: "서울시립미술관",
      headerImage: require("../../../assets/images/exhibitionPoster/exhibition8.png"),
      museumEmblem: undefined,
      address: "서울특별시 중구 덕수궁길 61",
      latitude: 37.565926,
      longitude: 126.975229,
      phone: "02-2345-6789",
      website: "www.sema.seoul.go.kr",
      hours: "화~일 10:00-20:00 (월요일 휴관)",
      entrance: "일반 3,000원, 학생 1,500원",
      closedDays: undefined,
      description:
        "서울시가 운영하는 대표적인 시립미술관으로, 시민과 가장 가까운 곳에서 다양한 현대미술을 선보이고 있습니다.",
      parking: undefined,
      parkingFee: undefined,
      subway: undefined,
      exhibitions: [
        {
          id: "8",
          title: "반 고흐 생애전",
          date: "2024.03.01 - 2024.05.15",
          image: require("../../../assets/images/exhibitionPoster/exhibition1.png"),
        },
      ],
    },
  };

  const museum = museumData[name as keyof typeof museumData];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5",
    },
    content: {
      flex: 1,
    },
    headerNavBar: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: 65,
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingVertical: 15,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
    },
    imageSection: {
      height: 200,
    },
    museumImage: {
      width: "100%",
      height: "100%",
    },
    museumInfoHeader: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#e0e0e0",
    },
    museumTitleSection: {
      flex: 1,
    },
    titleContainer: {
      width: "100%",
    },
    firstRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    secondRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    museumEmblem: {
      width: 100,
      height: 1,
      marginLeft: 12,
    },
    backButton: {
      padding: 5,
    },
    navTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#000",
      flex: 1,
      textAlign: "center",
      marginHorizontal: 20,
    },
    rightIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      padding: 5,
      marginLeft: 10,
    },
    museumNameLarge: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
    },
    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      margin: 0,
      padding: 0,
    },
    museumEmblemIcon: {
      width: 81,
      height: 60,
      marginLeft: 12,
    },
    leftSection: {
      flex: 1,
    },
    centerSection: {
      alignItems: "center",
    },
    rightIconsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    govText: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      fontWeight: "500",
    },
    govSubtext: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
    },
    locationText: {
      fontSize: 12,
      color: theme === "dark" ? "#999" : "#999",
    },
    headerSection: {
      padding: 25,
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      margin: 15,
      marginBottom: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    museumName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
      paddingVertical: 4,
    },
    infoText: {
      fontSize: 15,
      color: theme === "dark" ? "#ccc" : "#555",
      marginLeft: 12,
      flex: 1,
      lineHeight: 22,
      letterSpacing: 0.3,
    },
    infoLabel: {
      fontSize: 16,
      color: theme === "dark" ? "#fff" : "#1c3519",
      fontWeight: "700",
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    description: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
      lineHeight: 20,
      marginTop: 10,
    },
    section: {
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
      margin: 15,
      marginBottom: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 20,
      letterSpacing: 0.5,
    },
    exhibitionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#eee",
    },
    exhibitionImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 15,
    },
    exhibitionInfo: {
      flex: 1,
    },
    exhibitionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme === "dark" ? "#fff" : "#1c3519",
      marginBottom: 4,
    },
    exhibitionDate: {
      fontSize: 14,
      color: theme === "dark" ? "#ccc" : "#666",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },
    errorBackButton: {
      backgroundColor: "#4CAF50",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    backButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    locationInfo: {
      marginBottom: 15,
    },
    mapContainer: {
      alignItems: "center",
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
    infoSection: {
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#3a3a3a" : "#f0f0f0",
    },
  });

  if (!museum) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.errorText,
              { color: theme === "dark" ? "#fff" : "#333" },
            ]}>
            박물관 정보를 찾을 수 없습니다.
          </Text>
          <TouchableOpacity
            style={styles.errorBackButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />

      {/* 헤더 네비게이션 바 */}
      <View style={styles.headerNavBar}>
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons
            name='chevron-back'
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        {/* 박물관 이름 */}
        <Text style={styles.navTitle}>{museum.name}</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* 박물관 이미지 */}
        <View style={styles.imageSection}>
          <Image
            source={museum.headerImage}
            style={styles.museumImage}
            resizeMode='cover'
          />
        </View>

        {/* 박물관 정보 헤더 */}
        <View style={styles.museumInfoHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.firstRow}>
              <Text style={styles.museumNameLarge}>{museum.name}</Text>
              {museum.museumEmblem && (
                <Image
                  source={museum.museumEmblem}
                  style={styles.museumEmblemIcon}
                  resizeMode='contain'
                />
              )}
            </View>
            <View style={styles.secondRow}>
              <Text style={styles.locationText}>전시장소</Text>
              <View style={styles.rightIconsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  activeOpacity={0.7}>
                  <Ionicons
                    name='heart-outline'
                    size={24}
                    color={theme === "dark" ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  activeOpacity={0.7}>
                  <Ionicons
                    name='share-outline'
                    size={24}
                    color={theme === "dark" ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 박물관 기본 정보 */}
        <View style={styles.headerSection}>
          {/* 2. 관람시간 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>관람시간</Text>
            <Text style={styles.infoText}>{museum.hours}</Text>
          </View>

          {/* 3. 휴관일 및 휴실일 */}
          {museum.closedDays && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>휴관일 및 휴실일</Text>
              <Text style={styles.infoText}>{museum.closedDays}</Text>
            </View>
          )}

          {/* 4. 관람료 */}
          {museum.entrance && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>관람료</Text>
              <Text style={styles.infoText}>{museum.entrance}</Text>
            </View>
          )}

          {/* 5. 위치 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>위치</Text>
            <Text style={styles.infoText}>{museum.address}</Text>
          </View>

          {/* 6. 전화 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>전화</Text>
            <Text style={styles.infoText}>{museum.phone}</Text>
          </View>

          {/* 7. 지하철 */}
          {museum.subway && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>지하철</Text>
              <Text style={styles.infoText}>{museum.subway}</Text>
            </View>
          )}

          {/* 8. 버스 */}
          {museum.parking && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>버스</Text>
              <Text style={styles.infoText}>{museum.parking}</Text>
            </View>
          )}

          {/* 9. 주차요금 */}
          {museum.parkingFee && (
            <View
              style={[
                styles.infoSection,
                { borderBottomWidth: 0, paddingBottom: 0 },
              ]}>
              <Text style={styles.infoLabel}>주차요금</Text>
              <Text style={styles.infoText}>{museum.parkingFee}</Text>
            </View>
          )}
        </View>

        {/* 위치 정보 및 지도 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위치 정보</Text>

          {/* 주소 정보 */}
          <View style={styles.locationInfo}>
            <View style={styles.infoRow}>
              <Ionicons
                name='location-outline'
                size={16}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <Text style={styles.infoText}>{museum.address}</Text>
            </View>
          </View>

          {/* 네이버맵 */}
          <View style={styles.mapContainer}>
            <NaverMap
              latitude={museum.latitude}
              longitude={museum.longitude}
              title={museum.name}
              address={museum.address}
              height={250}
            />
          </View>
        </View>

        {/* 현재 전시 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            현재 전시 ({museum.exhibitions.length}개)
          </Text>

          {museum.exhibitions.map((exhibition, index) => (
            <TouchableOpacity
              key={exhibition.id}
              style={[
                styles.exhibitionItem,
                index === museum.exhibitions.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() => router.push(`/exhibition/${exhibition.id}` as any)}
              activeOpacity={0.7}>
              <Image
                source={exhibition.image}
                style={styles.exhibitionImage}
                resizeMode='cover'
              />
              <View style={styles.exhibitionInfo}>
                <Text style={styles.exhibitionTitle}>{exhibition.title}</Text>
                <Text style={styles.exhibitionDate}>{exhibition.date}</Text>
              </View>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
