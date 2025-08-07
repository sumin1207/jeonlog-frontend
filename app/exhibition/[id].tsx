import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useExhibition } from "../../contexts/ExhibitionContext";
import { ExhibitionDetailSkeleton } from "@/components/ui/Skeleton";
import AutoHeightImage from '@/components/ui/AutoHeightImage';
import WriteRecordButton from "../(tabs)/mypage/exhibition/WriteRecordButton";

import { exhibitionData } from "../../data/exhibitionsDataStorage"; // Import from central data source

export default function ExhibitionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const { isLiked, isThumbsUp, toggleLiked, toggleThumbsUp } = useExhibition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExhibition = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setLoading(false);
    };
    loadExhibition();
  }, []);

  const exhibition = exhibitionData[id as keyof typeof exhibitionData];

  if (loading) {
    return <ExhibitionDetailSkeleton />;
  }

  if (!exhibition) {
    return (
      <View
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
      </View>
    );
  }

  return (
    <View
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
            <View style={{ alignItems: "flex-end" }}>
              <WriteRecordButton
                title='기록하기'
                onPress={() =>
                  router.push({
                    pathname: "/exhibition/write-record",
                    params: { exhibitionId: id },
                  })
                }
                buttonStyle={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  marginTop: 10,
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
          {(exhibition as any).explanation && (
            <View style={styles.infoSection}>
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
                {(exhibition as any).explanation}
              </Text>
            </View>
          )}

          {/* 설명 포스터 이미지  출력 */}
          {(exhibition as any).explanationImages &&
            (exhibition as any).explanationImages.length > 0 && (
              <View style={styles.explanationImageContainer}>
                {(exhibition as any).explanationImages.map(
                  (image: any, index: number) => (
                    <AutoHeightImage
                      key={index}
                      source={image}
                      imageWidth={Dimensions.get("window").width * 0.95}
                    />
                  )
                )}
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
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${exhibition.phone}`)}>
                  <Text
                    style={[
                      styles.infoValue,
                      styles.linkText,
                      { color: theme === "dark" ? "#4A90E2" : "#007AFF" },
                    ]}>
                    {exhibition.phone}
                  </Text>
                </TouchableOpacity>
                {(exhibition as any).email && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(`mailto:${(exhibition as any).email}`)
                    }>
                    <Text
                      style={[
                        styles.infoValue,
                        styles.linkText,
                        { color: theme === "dark" ? "#4A90E2" : "#007AFF" },
                      ]}>
                      {(exhibition as any).email}
                    </Text>
                  </TouchableOpacity>
                )}
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
    </View>
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
  explanationImageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
});