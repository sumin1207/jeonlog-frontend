import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useExhibition } from "../../contexts/ExhibitionContext";
import WriteRecordButton from "../(tabs)/mypage/exhibition/WriteRecordButton";

// 전시 데이터 (나중에 API로 대체)
const exhibitionData = {
  "1": {
    id: "1",
    title: "일본미술, 네 가지 시선",
    location: "국립중앙박물관 상설전시관 3층 306호",
    address: "서울특별시 용산구 서빙고로 137",
    date: "2025.06.17 - 2025.08.10",
    time: "10:00 - 18:00(월/화/목/금/일), 10:00 - 21:00(수/토)",
    price: "무료",
    category: "전시",
    description:
      "	네 가지 시선을 따라 일본미술이 지닌 다채로운 아름다움을 살펴보는 전시",
    exhibits: "<가을풀무늬 고소데> 등 62건",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
    sponsor: "국립중앙박물관",
    phone: "세계문화부 최종은 (02-2077-9554)",
    website: "www.museum.go.kr",
  },
  "2": {
    id: "2",
    title: "모네 특별전",
    subtitle: "Monet Special Exhibition",
    location: "서울시립미술관",
    address: "서울특별시 중구 덕수궁길 61",
    date: "2024.02.01 - 2024.04.30",
    time: "10:00 - 19:00 (월요일 휴관)",
    price: "성인 20,000원",
    category: "전시",
    description:
      "인상주의의 대가 클로드 모네의 작품들을 한자리에서 감상할 수 있는 특별전입니다. 그의 대표작들과 함께 생애를 돌아봅니다.",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
    curator: "박인상",
    sponsor: "서울시립미술관",
    phone: "02-2345-6789",
    website: "www.sema.seoul.go.kr",
  },
  "3": {
    id: "3",
    title: "반 고흐 생애전",
    subtitle: "Van Gogh Life Exhibition",
    location: "서울시립미술관",
    address: "서울특별시 중구 덕수궁길 61",
    date: "2024.03.01 - 2024.05.15",
    time: "10:00 - 19:00 (월요일 휴관)",
    price: "성인 25,000원",
    category: "전시",
    description:
      "빈센트 반 고흐의 생애와 작품 세계를 조명하는 특별전입니다. 그의 유명한 작품들과 함께 예술가로서의 삶을 살펴봅니다.",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
    curator: "이후기",
    sponsor: "서울시립미술관",
    phone: "02-2345-6789",
    website: "www.sema.seoul.go.kr",
  },
  "4": {
    id: "4",
    title: "현대미술 특별전",
    subtitle: "Contemporary Art Special Exhibition",
    location: "MMCA",
    address: "서울특별시 종로구 삼청로 30",
    date: "2024.01.20 - 2024.05.20",
    time: "10:00 - 18:00 (월요일 휴관)",
    price: "성인 12,000원",
    category: "전시",
    description:
      "현대미술의 다양한 경향과 작품들을 소개하는 특별전입니다. 국내외 현대미술가들의 작품을 통해 현재의 예술을 이해합니다.",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
    curator: "최현대",
    sponsor: "국립현대미술관",
    phone: "02-3456-7890",
    website: "www.mmca.go.kr",
  },
  "5": {
    id: "5",
    title: "한국미술 100년",
    subtitle: "100 Years of Korean Art",
    location: "국립중앙박물관",
    address: "서울특별시 용산구 서빙고로 137",
    date: "2024.04.01 - 2024.06.30",
    time: "10:00 - 18:00 (월요일 휴관)",
    price: "성인 15,000원",
    category: "전시",
    description:
      "한국미술의 100년 역사를 조명하는 특별전입니다. 근대부터 현대까지 한국미술의 발전 과정을 한눈에 볼 수 있습니다.",
    image: require("../../assets/images/exhibitionPoster/exhibition1.png"),
    curator: "정한국",
    sponsor: "국립중앙박물관",
    phone: "02-1234-5678",
    website: "www.museum.go.kr",
  },
};

export default function ExhibitionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const { isLiked, isThumbsUp, toggleLiked, toggleThumbsUp } = useExhibition();

  const exhibition = exhibitionData[id as keyof typeof exhibitionData];

  if (!exhibition) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5" },
        ]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons
              name='arrow-back'
              size={24}
              color={theme === "dark" ? "#fff" : "#1c3519"}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: theme === "dark" ? "#fff" : "#1c3519" },
            ]}>
            전시 상세
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.errorText,
              { color: theme === "dark" ? "#ccc" : "#666" },
            ]}>
            전시 정보를 찾을 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5" },
      ]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={theme === "dark" ? "#fff" : "#1c3519"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: theme === "dark" ? "#fff" : "#1c3519" },
          ]}>
          전시 상세
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* 포스터 이미지 */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: theme === "dark" ? "#2a2a2a" : "#f5f5f5" },
          ]}>
          <Image
            source={exhibition.image}
            style={styles.posterImage}
            resizeMode='contain'
          />
        </View>

        {/* 전시 정보 */}
        <View style={styles.content}>
          {/* 제목 */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.title,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  {exhibition.title}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}></Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleLiked(id as string)}>
                  <Ionicons
                    name={isLiked(id as string) ? "heart" : "heart-outline"}
                    size={24}
                    color={
                      isLiked(id as string)
                        ? "#FF6B6B"
                        : theme === "dark"
                        ? "#ccc"
                        : "#666"
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleThumbsUp(id as string)}>
                  <Ionicons
                    name={
                      isThumbsUp(id as string)
                        ? "thumbs-up"
                        : "thumbs-up-outline"
                    }
                    size={24}
                    color={
                      isThumbsUp(id as string)
                        ? "#4CAF50"
                        : theme === "dark"
                        ? "#ccc"
                        : "#666"
                    }
                  />
                </TouchableOpacity>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>                                                       
            <WriteRecordButton 
              title="기록하기" 
                onPress={() =>
                router.push({
                  pathname: "/exhibition/write-record",
                  params: { exhibitionId: id },
                })
              } 
              buttonStyle={{ 
                paddingVertical: 8, 
                paddingHorizontal: 16, 
                marginTop: 10
              }}
              textStyle={{ fontSize: 14 }}
            />
            </View>
            <View
              style={[
                styles.categoryTag,
                {
                  backgroundColor:
                    exhibition.category === "전시" ? "#4CAF50" : "#2196F3",
                },
              ]}>
              <Text style={styles.categoryText}>{exhibition.category}</Text>
            </View>
          </View>

          {/* 기본 정보 */}
          <View style={styles.infoSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme === "dark" ? "#fff" : "#1c3519" },
              ]}>
              기본 정보
            </Text>

            <View style={styles.infoItem}>
              <Ionicons
                name='location'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  장소
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  {exhibition.location}
                </Text>
                <Text
                  style={[
                    styles.infoAddress,
                    { color: theme === "dark" ? "#999" : "#888" },
                  ]}>
                  {exhibition.address}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name='calendar'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  기간
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  {exhibition.date}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name='time'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  관람시간
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  {exhibition.time}
                </Text>
              </View>
            </View>

            {(exhibition as any).exhibits && (
              <View style={styles.infoItem}>
                <Ionicons
                  name='card'
                  size={20}
                  color={theme === "dark" ? "#ccc" : "#666"}
                />
                <View style={styles.infoContent}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme === "dark" ? "#ccc" : "#666" },
                    ]}>
                    전시품
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme === "dark" ? "#fff" : "#1c3519" },
                    ]}>
                    {(exhibition as any).exhibits}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoItem}>
              <Ionicons
                name='card'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  관람료
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  {exhibition.price}
                </Text>
              </View>
            </View>
          </View>

          {/* 전시 설명 */}
          <View style={styles.descriptionSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme === "dark" ? "#fff" : "#1c3519" },
              ]}>
              전시 요약
            </Text>
            <Text
              style={[
                styles.description,
                { color: theme === "dark" ? "#ccc" : "#666" },
              ]}>
              {exhibition.description}
            </Text>
          </View>

          {/* 전시 소개 */}
          {exhibition.id === "1" && (
            <View style={styles.descriptionSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme === "dark" ? "#fff" : "#1c3519" },
                ]}>
                전시 소개
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: theme === "dark" ? "#ccc" : "#666" },
                ]}>
                국립중앙박물관과 도쿄국립박물관은 한일 국교 정상화 60주년을
                기념하여, 일본미술을 새로운 시각에서 조망하는 특별전 《일본미술,
                네 가지 시선》을 공동 개최합니다. 양 기관은 오랫동안 양국의
                역사와 문화에 대한 이해를 높이기 위해 긴밀히 교류해 왔으며, 그
                성과를 바탕으로 한국 관람객에게 일본미술을 소개하는 뜻깊은
                자리를 마련하였습니다.{"\n\n"}이번 전시는 도쿄국립박물관과
                국립중앙박물관이 엄선한 소장품 62건을 중심으로, 일본미술이 지닌
                외적인 아름다움과 내면의 정서를 눈과 마음으로 감상할 수 있도록
                구성하였습니다. 화려한 장식성(飾り), 이에 대비되는 절제된
                미(反飾り), 자연의 섬세한 변화에 대한 감동(あはれ), 유쾌하고
                재치 있는 미적 감각(遊び)이라는 네 가지 시선을 통해 일본미술을
                조명합니다. 이 요소들은 서로 유기적으로 어우러지며 일본인의 삶과
                세계관을 반영합니다. 일본미술의 시각적 매력을 넘어서, 그 내면에
                흐르는 사유와 감성을 오롯이 경험하는 기회를 선사할 것입니다.
                {"\n\n"}네 가지 시선을 따라 일본미술을 좀 더 친숙하게 감상하고,
                나아가 일본 문화를 폭넓게 이해할 수 있는 시간이 되기를 바랍니다.
              </Text>
            </View>
          )}

          {/* 추가 정보 */}
          <View style={styles.additionalSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme === "dark" ? "#fff" : "#1c3519" },
              ]}>
              추가 정보
            </Text>

            {(exhibition as any).curator && (
              <View style={styles.infoItem}>
                <Ionicons
                  name='person'
                  size={20}
                  color={theme === "dark" ? "#ccc" : "#666"}
                />
                <View style={styles.infoContent}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme === "dark" ? "#ccc" : "#666" },
                    ]}>
                    큐레이터
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme === "dark" ? "#fff" : "#1c3519" },
                    ]}>
                    {(exhibition as any).curator}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoItem}>
              <Ionicons
                name='business'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  주최
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  {exhibition.sponsor}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name='call'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  문의
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme === "dark" ? "#fff" : "#1c3519" },
                  ]}>
                  {exhibition.phone}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name='globe'
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              />
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://${exhibition.website}`)}
                style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  웹사이트
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme === "dark" ? "#4A90E2" : "#007AFF" },
                    styles.linkText,
                  ]}>
                  {exhibition.website}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 400,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 30,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 15,
    padding: 8,
  },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 30,
  },
  descriptionSection: {
    marginBottom: 30,
  },
  additionalSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
  },
});
