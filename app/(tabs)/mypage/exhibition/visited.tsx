import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useExhibition } from "../../../../contexts/ExhibitionContext";
import { exhibitionData } from "../../../../data/exhibitionsDataStorage";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WriteRecordButton from "./WriteRecordButton";
import DeleteRecordButton from "././DeleteRecordButton";
import { Text, Container } from "../../../../design-system";
import { VisitedStyles } from "../../../../design-system/styles";
import { Colors } from "../../../../design-system/theme";

export default function VisitedExhibitionsPage() {
  const { theme } = useTheme();
  const { visitedExhibitions, myLogs } = useExhibition();
  const router = useRouter();

  const visitedExhibitionsData = visitedExhibitions
    .map((id) => {
      const exhibition = exhibitionData[id as keyof typeof exhibitionData];
      if (!exhibition) return null;
      const record = myLogs.find((log) => log.id === id);
      return {
        ...exhibition,
        id,
        review: record ? record.title : "아직 기록하지 않은 전시",
      };
    })
    .filter(Boolean)
    .reverse();

  const renderExhibitionItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={VisitedStyles.exhibitionItem}
      onPress={() => {
        if (item.id && typeof item.id === "string") {
          console.log("Navigating to exhibition log with ID:", item.id);
          router.push(`/exhibition-log/${item.id}`);
        } else {
          console.log("Invalid exhibition ID for navigation:", item.id);
        }
      }}>
      <Image
        source={item.image}
        style={VisitedStyles.exhibitionImage}
      />
      <View style={VisitedStyles.exhibitionInfo}>
        <Text
          style={VisitedStyles.exhibitionTitle}
          numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={VisitedStyles.exhibitionLocation}>{item.location}</Text>
        <Text style={VisitedStyles.reviewText}>💬 "{item.review}"</Text>
      </View>
      <View>
        <WriteRecordButton
          title='기록 수정'
          onPress={() =>
            router.push({
              pathname: "/exhibition/write-record",
              params: { exhibitionId: item.id },
            })
          }
          buttonStyle={{
            paddingVertical: 6,
            paddingHorizontal: 6,
            alignSelf: "flex-start",
          }}
          textStyle={{ fontSize: 14 }}
        />
        <DeleteRecordButton
          exhibitionId={item.id}
          title='기록 삭제'
          onRecordDeleted={() =>
            console.log("Record deletion callback triggered.")
          }
          buttonStyle={{
            paddingVertical: 6,
            paddingHorizontal: 6,
            marginTop: 8,
            alignSelf: "flex-start",
          }}
          textStyle={{ fontSize: 14 }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Container style={VisitedStyles.container}>
      <View style={VisitedStyles.header}>
        <Pressable
          onPress={() => router.back()}
          style={VisitedStyles.backButton}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={Colors.text.primary}
          />
        </Pressable>
        <Text style={VisitedStyles.headerTitle}>
          방문한 전시 ({visitedExhibitionsData.length}개)
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {visitedExhibitionsData.length > 0 ? (
        <FlatList
          data={visitedExhibitionsData}
          renderItem={renderExhibitionItem}
          keyExtractor={(item) => item?.id || ""}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={VisitedStyles.listContentContainer}
        />
      ) : (
        <View style={VisitedStyles.emptyContainer}>
          <Text style={VisitedStyles.emptyText}>
            아직 방문한 전시가 없습니다.
          </Text>
          <Text style={VisitedStyles.emptySubText}>
            전시를 관람하고 방문 기록을 남겨보세요!
          </Text>
        </View>
      )}
    </Container>
  );
}
