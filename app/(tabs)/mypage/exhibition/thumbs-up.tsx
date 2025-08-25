import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useExhibition } from "../../../../contexts/ExhibitionContext";
import { exhibitionData } from "../../../../data/exhibitionsDataStorage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Container } from "../../../../design-system";
import { ThumbsUpStyles } from "../../../../design-system/styles";
import { Colors } from "../../../../design-system/theme";

export default function ThumbsUpExhibitionsScreen() {
  const { theme } = useTheme();
  const { thumbsUpExhibitions } = useExhibition();
  const router = useRouter();

  const thumbsUpExhibitionsData = thumbsUpExhibitions
    .map((id) => exhibitionData[id as keyof typeof exhibitionData])
    .filter(Boolean);

  const renderExhibitionItem = ({
    item,
  }: {
    item: (typeof exhibitionData)[keyof typeof exhibitionData];
  }) => (
    <TouchableOpacity
      style={ThumbsUpStyles.exhibitionItem}
      onPress={() => router.push(`/exhibition/${item.id}`)}>
      <Image
        source={item.image}
        style={ThumbsUpStyles.exhibitionImage}
      />
      <View style={ThumbsUpStyles.exhibitionInfo}>
        <Text
          style={ThumbsUpStyles.exhibitionTitle}
          numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={ThumbsUpStyles.exhibitionLocation}>{item.location}</Text>
        <Text style={ThumbsUpStyles.exhibitionDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={ThumbsUpStyles.container}>
      <View style={ThumbsUpStyles.header}>
        <Pressable
          onPress={() => router.back()}
          style={ThumbsUpStyles.backButton}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={Colors.text.primary}
          />
        </Pressable>
        <Text style={ThumbsUpStyles.headerTitle}>
          좋아요한 전시 ({thumbsUpExhibitionsData.length}개)
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {thumbsUpExhibitionsData.length > 0 ? (
        <FlatList
          data={thumbsUpExhibitionsData}
          renderItem={renderExhibitionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ThumbsUpStyles.listContentContainer}
        />
      ) : (
        <View style={ThumbsUpStyles.emptyContainer}>
          <Text style={ThumbsUpStyles.emptyText}>
            좋아요한 전시가 없습니다.
          </Text>
        </View>
      )}
    </View>
  );
}
