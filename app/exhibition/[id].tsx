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
import AutoHeightImage from "@/components/ui/AutoHeightImage";
import WriteRecordButton from "../(tabs)/mypage/exhibition/WriteRecordButton";
import { BookmarkButton } from "@/components/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context"; //노치 가리는 문제

import { exhibitionData } from "../../data/exhibitionsDataStorage"; // Import from central data source
import { style } from "././[id].styles";

export default function ExhibitionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const { isBookmarked, isThumbsUp, toggleBookmarked, toggleThumbsUp } =
    useExhibition();
  const [loading, setLoading] = useState(true);
  const styles = style(theme);
  const insets = useSafeAreaInsets();

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
          { backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff" },
        ]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons
              name='arrow-back'
              size={24}
              color={theme === "dark" ? "#fff" : "#000000"}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: theme === "dark" ? "#fff" : "#000000" },
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
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={theme === "dark" ? "#fff" : "#000000"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: theme === "dark" ? "#fff" : "#000000" },
          ]}>
          전시 상세
        </Text>
        <BookmarkButton
          exhibitionId={id as string}
          size={24}
          color={theme === "dark" ? "#fff" : "#000000"}
          activeColor='#FF6B6B'
        />
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
                    { color: theme === "dark" ? "#fff" : "#000000" },
                  ]}>
                  {exhibition.title}
                </Text>
                {/* 빈 subtitle 제거 */}
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleBookmarked(id as string)}>
                  <Ionicons
                    name={
                      isBookmarked(id as string)
                        ? "bookmark"
                        : "bookmark-outline"
                    }
                    size={24}
                    color={
                      isBookmarked(id as string)
                        ? "#ffb92eff"
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
                        ? "#6200ffff"
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
                buttonStyle={styles.recordButton}
                textStyle={{ fontSize: 14 }}
              />
            </View>
            {/*
            <View
              style={[
                styles.categoryTag,
                {
                  backgroundColor:
                    exhibition.category === "전시" ? "#1c3519" : "#9cb79bff",
                },
              ]}
            >
              <Text style={styles.categoryText}>{exhibition.category}</Text>
            </View>
              */}
          </View>

          {/* 기본 정보 */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>기본 정보</Text>

            <View style={styles.infoItem}>
              {/*<Ionicons
                name="location"
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              /> */}
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  장소
                </Text>
                <Text style={styles.infoValue}>{exhibition.location}</Text>
                <Text style={styles.infoAddress}>({exhibition.address})</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              {/* <Ionicons
                name="calendar"
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              /> */}

              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  기간
                </Text>
                <Text style={styles.infoValue}>{exhibition.date}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              {/* <Ionicons
                name="time"
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              /> */}
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme === "dark" ? "#ccc" : "#666" },
                  ]}>
                  관람시간
                </Text>
                <Text style={styles.infoValue}>{exhibition.time}</Text>
              </View>
            </View>

            {(exhibition as any).exhibits && (
              <View style={styles.infoItem}>
                {/* <Ionicons
                  name="card"
                  size={20}
                  color={theme === "dark" ? "#ccc" : "#666"}
                /> */}
                <View style={styles.infoContent}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme === "dark" ? "#ccc" : "#666" },
                    ]}>
                    전시품
                  </Text>
                  <Text style={styles.infoValue}>
                    {(exhibition as any).exhibits}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoItem}>
              {/*<Ionicons
                name="card"
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              /> */}
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
                { color: theme === "dark" ? "#fff" : "#000000" },
              ]}>
              전시 요약
            </Text>
            <Text
              style={[
                styles.description,
                { color: theme === "dark" ? "#ccc" : "#000000" },
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
                  { color: theme === "dark" ? "#fff" : "#000000" },
                ]}>
                전시 소개
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: theme === "dark" ? "#ccc" : "#000000" },
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
                { color: theme === "dark" ? "#fff" : "#000000" },
              ]}>
              추가 정보
            </Text>

            <View style={styles.infoItem}>
              {/* <Ionicons
                name="business"
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              /> */}
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>주최</Text>
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
              {/* <Ionicons
                name="call"
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              /> */}
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>문의</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${exhibition.phone}`)}>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme === "dark" ? "#ffffff" : "#000000" },
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
                        { color: theme === "dark" ? "#ffffff" : "#000000" },
                      ]}>
                      {(exhibition as any).email}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              {/* <Ionicons
                name="globe"
                size={20}
                color={theme === "dark" ? "#ccc" : "#666"}
              /> */}
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
