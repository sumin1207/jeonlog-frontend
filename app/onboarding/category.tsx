import { useRouter } from "expo-router";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import TopBar from "@/components/ui/TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import { Stack } from "expo-router";

export default function UserInfoPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [birthYear, setBirthYear] = useState("");

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear;

  const canProceed =
    gender &&
    birthYear.length === 4 &&
    parseInt(birthYear) >= minYear &&
    parseInt(birthYear) <= maxYear;

  const handleGenderSelect = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
  };

  const handleNext = () => {
    if (canProceed) {
      // 여기서 사용자 정보를 저장하거나 처리할 수 있습니다
      router.replace("/onboarding/interest");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
        }}>
        <ScrollView
          style={{
            flex: 1,
            paddingTop: 54,
            paddingHorizontal: 32,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 52,
              textAlign: "left",
              color: theme === "dark" ? "#fff" : "#1c3519",
            }}>
            전시 추천을 위한 {"\n"}기본 정보를 입력해주세요
          </Text>

          {/* 성별 선택 */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 16,
                color: theme === "dark" ? "#fff" : "#1c3519",
              }}>
              성별
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
              }}>
              <TouchableOpacity
                style={[
                  styles.genderButtonBase,
                  gender === "male"
                    ? styles.genderButtonSelected
                    : styles.genderButtonUnselected,
                ]}
                onPress={() => handleGenderSelect("male")}>
                <Text
                  style={{
                    color: gender === "male" ? "#1c3519" : "#d2d2d2",
                    fontSize: 16,
                    fontWeight: "600",
                  }}>
                  남성
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButtonBase,
                  gender === "female"
                    ? styles.genderButtonSelected
                    : styles.genderButtonUnselected,
                ]}
                onPress={() => handleGenderSelect("female")}>
                <Text
                  style={{
                    color: gender === "female" ? "#1c3519" : "#d2d2d2",
                    fontSize: 16,
                    fontWeight: "600",
                  }}>
                  여성
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 출생연도 입력 */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 16,
                color: theme === "dark" ? "#fff" : "#1c3519",
              }}>
              출생연도
            </Text>
            <TextInput
              style={[
                styles.yearInput,
                {
                  backgroundColor: theme === "dark" ? "#2a2a2a" : "#f5f5f5",
                  color: theme === "dark" ? "#fff" : "#1c3519",
                  borderColor:
                    birthYear.length === 4 &&
                    parseInt(birthYear) >= minYear &&
                    parseInt(birthYear) <= maxYear
                      ? "#1c3519"
                      : "#d2d2d2",
                },
              ]}
              placeholder='예: 1995'
              placeholderTextColor={theme === "dark" ? "#999" : "#999"}
              value={birthYear}
              onChangeText={setBirthYear}
              keyboardType='numeric'
              maxLength={4}
            />
            <Text
              style={{
                color: theme === "dark" ? "#ccc" : "#7e7e7e",
                fontSize: 12,
                marginTop: 8,
              }}>
              {minYear}년 ~ {maxYear}년 사이로 입력해주세요
            </Text>
            {birthYear.length === 4 &&
              (parseInt(birthYear) < minYear ||
                parseInt(birthYear) > maxYear) && (
                <Text
                  style={{
                    color: "#ff4444",
                    fontSize: 12,
                    marginTop: 4,
                    fontWeight: "500",
                  }}>
                  {minYear}년 ~ {maxYear}년 사이의 연도를 입력해주세요
                </Text>
              )}
          </View>

          {/* 안내 텍스트 */}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                color: theme === "dark" ? "#ccc" : "#7e7e7e",
                fontSize: 14,
                lineHeight: 20,
              }}>
              입력하신 정보는 전시 추천을 위해서만 사용되며, {"\n"}
              개인정보 보호 정책에 따라 안전하게 관리됩니다.
            </Text>
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[
            styles.nextButtonBase,
            canProceed ? styles.nextButtonActive : styles.nextButtonDisabled,
            styles.nextButtonFixed,
          ]}
          onPress={handleNext}
          disabled={!canProceed}>
          <Text style={styles.nextButtonText}>다음으로 넘어가기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  genderButtonBase: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#d2d2d2",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  genderButtonSelected: {
    borderColor: "#1c3519",
    backgroundColor: "#f0f8f0",
  },
  genderButtonUnselected: {
    backgroundColor: "#fff",
  },
  yearInput: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    textAlign: "center",
  },
  nextButtonBase: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
  },
  nextButtonActive: {
    backgroundColor: "#1c3519",
  },
  nextButtonDisabled: {
    backgroundColor: "#d2d2d2",
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  nextButtonFixed: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
});
