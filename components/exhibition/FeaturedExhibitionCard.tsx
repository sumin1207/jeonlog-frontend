import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/design-system/theme";
import { Spacing } from "@/design-system/theme";

interface FeaturedExhibitionCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  price: string;
  imageSource: any;
  dimensions?: string;
}

export default function FeaturedExhibitionCard({
  id,
  title,
  description,
  location,
  date,
  price,
  imageSource,
  dimensions,
}: FeaturedExhibitionCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/exhibition/${id}` as any);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode='cover'
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={styles.title}
          numberOfLines={2}>
          {title}
        </Text>
        <Text
          style={styles.description}
          numberOfLines={3}>
          {description}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>장소:</Text>
            <Text style={styles.detailValue}>{location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>날짜:</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
        </View>

        {dimensions && (
          <View style={styles.dimensionsContainer}>
            <Text style={styles.dimensionsText}>{dimensions}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  detailsContainer: {
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    width: 40,
    marginRight: Spacing.xs,
  },
  detailValue: {
    fontSize: 12,
    color: Colors.text.primary,
    flex: 1,
  },
  dimensionsContainer: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  dimensionsText: {
    fontSize: 10,
    color: Colors.text.inverse,
    fontWeight: "500",
  },
});
