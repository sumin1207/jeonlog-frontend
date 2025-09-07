import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Container, Row, Column } from "../../design-system";
import {
  VisitedExhibition,
  getVisitedExhibitions,
} from "../../services/userService";
import { Colors } from "../../design-system/theme";

interface VisitedExhibitionsListProps {
  maxItems?: number;
  showTitle?: boolean;
  onPressExhibition?: (exhibition: VisitedExhibition) => void;
}

export default function VisitedExhibitionsList({
  maxItems,
  showTitle = true,
  onPressExhibition,
}: VisitedExhibitionsListProps) {
  const router = useRouter();
  const [visitedExhibitions, setVisitedExhibitions] = useState<
    VisitedExhibition[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVisitedExhibitions();
  }, []);

  const loadVisitedExhibitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const exhibitions = await getVisitedExhibitions();
      setVisitedExhibitions(exhibitions);
    } catch (err) {
      console.error("방문 완료 전시 목록 로드 실패:", err);
      setError(
        err instanceof Error
          ? err.message
          : "방문 완료 전시 목록을 불러올 수 없습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExhibitionPress = (exhibition: VisitedExhibition) => {
    if (onPressExhibition) {
      onPressExhibition(exhibition);
    } else {
      // 기본 동작: 전시 상세 페이지로 이동
      router.push(`/exhibition/${exhibition.id}`);
    }
  };

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

  const displayExhibitions = maxItems
    ? visitedExhibitions.slice(0, maxItems)
    : visitedExhibitions;

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator
          size='large'
          color={Colors.primary.main}
        />
        <Text
          variant='body'
          style={{ marginTop: 10, color: Colors.text.secondary }}>
          방문 완료 전시를 불러오는 중...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Ionicons
          name='alert-circle-outline'
          size={48}
          color={Colors.status.error}
        />
        <Text
          variant='body'
          style={{
            marginTop: 10,
            color: Colors.status.error,
            textAlign: "center",
          }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={loadVisitedExhibitions}
          style={{
            marginTop: 10,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: Colors.primary.main,
            borderRadius: 8,
          }}>
          <Text
            variant='body'
            style={{ color: Colors.neutral.white }}>
            다시 시도
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (visitedExhibitions.length === 0) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Ionicons
          name='checkmark-circle-outline'
          size={48}
          color={Colors.text.secondary}
        />
        <Text
          variant='body'
          style={{
            marginTop: 10,
            color: Colors.text.secondary,
            textAlign: "center",
          }}>
          아직 방문 완료한 전시가 없습니다
        </Text>
        <Text
          variant='caption'
          style={{
            marginTop: 4,
            color: Colors.text.secondary,
            textAlign: "center",
          }}>
          전시를 방문하고 기록을 남겨보세요
        </Text>
      </View>
    );
  }

  return (
    <View>
      {showTitle && (
        <Row
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}>
          <Text variant='h4'>방문 완료한 전시</Text>
          <Text
            variant='caption'
            style={{ color: Colors.text.secondary }}>
            총 {visitedExhibitions.length}개
          </Text>
        </Row>
      )}

      <View style={{ gap: 12 }}>
        {displayExhibitions.map((exhibition) => (
          <TouchableOpacity
            key={exhibition.id}
            onPress={() => handleExhibitionPress(exhibition)}
            style={{
              backgroundColor: Colors.white,
              borderRadius: 12,
              padding: 16,
              shadowColor: Colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Row style={{ gap: 12 }}>
              <Image
                source={{ uri: exhibition.posterUrl }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  backgroundColor: Colors.neutral.gray100,
                }}
                resizeMode='cover'
              />
              <Column style={{ flex: 1, justifyContent: "space-between" }}>
                <View>
                  <Text
                    variant='body'
                    style={{ fontWeight: "600", marginBottom: 4 }}>
                    {exhibition.title}
                  </Text>
                  <Text
                    variant='caption'
                    style={{ color: Colors.text.secondary, marginBottom: 2 }}>
                    {exhibition.location}
                  </Text>
                  <Text
                    variant='caption'
                    style={{ color: Colors.text.secondary }}>
                    {formatDate(exhibition.startDate)} -{" "}
                    {formatDate(exhibition.endDate)}
                  </Text>
                </View>
                <Row style={{ alignItems: "center", marginTop: 8 }}>
                  <Ionicons
                    name='checkmark-circle'
                    size={16}
                    color={Colors.status.success}
                  />
                  <Text
                    variant='caption'
                    style={{ color: Colors.status.success, marginLeft: 4 }}>
                    방문 완료
                  </Text>
                </Row>
              </Column>
              <Ionicons
                name='chevron-forward'
                size={20}
                color={Colors.text.secondary}
              />
            </Row>
          </TouchableOpacity>
        ))}
      </View>

      {maxItems && visitedExhibitions.length > maxItems && (
        <TouchableOpacity
          onPress={() => {
            // 전체 목록 보기 페이지로 이동 (추후 구현)
            Alert.alert(
              "알림",
              "전체 방문 완료 전시 목록 페이지는 준비 중입니다."
            );
          }}
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: Colors.neutral.gray100,
            borderRadius: 8,
            alignItems: "center",
          }}>
          <Text
            variant='body'
            style={{ color: Colors.primary.main }}>
            더보기 ({visitedExhibitions.length - maxItems}개 더)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
