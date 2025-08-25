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
import { BookmarkedStyles } from "../../../../design-system/styles";
import { Colors } from "../../../../design-system/theme";

export default function BookmarkedExhibitionsScreen() {
  const { theme } = useTheme();
  const { BookmarkedExhibitions } = useExhibition();
  const router = useRouter();

  const bookmarkedExhibitionsData = BookmarkedExhibitions.map(
    (id) => exhibitionData[id as keyof typeof exhibitionData]
  ).filter(Boolean);

  const renderExhibitionItem = ({
    item,
  }: {
    item: (typeof exhibitionData)[keyof typeof exhibitionData];
  }) => (
    <TouchableOpacity
      style={BookmarkedStyles.exhibitionItem}
      onPress={() => router.push(`/exhibition/${item.id}`)}>
      <Image
        source={item.image}
        style={BookmarkedStyles.exhibitionImage}
      />
      <View style={BookmarkedStyles.exhibitionInfo}>
        <Text
          style={BookmarkedStyles.exhibitionTitle}
          numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={BookmarkedStyles.exhibitionLocation}>{item.location}</Text>
        <Text style={BookmarkedStyles.exhibitionDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container style={BookmarkedStyles.container}>
      <View style={BookmarkedStyles.header}>
        <Pressable
          onPress={() => router.back()}
          style={BookmarkedStyles.backButton}>
          <Ionicons
            name='arrow-back'
            size={24}
            color={Colors.text.primary}
          />
        </Pressable>
        <Text style={BookmarkedStyles.headerTitle}>
          찜한 전시 ({bookmarkedExhibitionsData.length}개)
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {bookmarkedExhibitionsData.length > 0 ? (
        <FlatList
          data={bookmarkedExhibitionsData}
          renderItem={renderExhibitionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={BookmarkedStyles.listContentContainer}
        />
      ) : (
        <View style={BookmarkedStyles.emptyContainer}>
          <Text style={BookmarkedStyles.emptyText}>찜한 전시가 없습니다.</Text>
        </View>
      )}
    </Container>
  );
}
