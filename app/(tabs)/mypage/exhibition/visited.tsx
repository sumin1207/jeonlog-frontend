import React from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Container } from "../../../../design-system";
import { VisitedStyles } from "../../../../design-system/styles";
import { Colors } from "../../../../design-system/theme";
import { VisitedExhibitionsList } from "../../../../components/exhibition";

export default function VisitedExhibitionsPage() {
  const router = useRouter();

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
        <Text style={VisitedStyles.headerTitle}>방문 완료한 전시</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <VisitedExhibitionsList showTitle={false} />
      </View>
    </Container>
  );
}
