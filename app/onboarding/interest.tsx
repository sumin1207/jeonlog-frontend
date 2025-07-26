import { useRouter } from "expo-router";
import { Button, View, Text, TouchableOpacity,StyleSheet, Image } from "react-native";
import React, { useState } from "react";

  const images = [
  { id: "one", uri: "https://via.placeholder.com/150?text=전시" },
  { id: "two", uri: "https://via.placeholder.com/150?text=연극" },
  { id: "three", uri: "https://via.placeholder.com/150?text=뮤지컬" },
  { id: "four", uri: "https://via.placeholder.com/150?text=무용" },
];

export default function InterestPage() {
  const router = useRouter();
  const [selected, setSelected] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
  });

  const handleSelect = (id: keyof typeof selected) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

    const canProceed = Object.values(selected).some((v) => v === true);


  return (
  <View style={{ flex: 1, justifyContent: "flex-start", paddingTop: 54, paddingHorizontal: 32 }}>
    <Text style={{ fontSize: 28, fontWeight: "bold", alignItems: "flex-start", marginBottom: 52, textAlign: "left"  }}>
        관심 있는 전시/연극을 선택해주세요
        </Text>
      {/* 관심 선택 UI는 추후 추가 */}

       {/* 위쪽 두 개 */}
<View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
  {images.slice(0, 2).map(({ id, uri }) => (
    <TouchableOpacity key={id} onPress={() => handleSelect(id)}>
      <Image
        source={{ uri }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 8,
          borderWidth: 4,
          borderColor: selected[id as keyof typeof selected] ? "#1c3519" : "#7e7e7e",
        }}
      />
    </TouchableOpacity>
  ))}
</View>

{/* 아래쪽 두 개 */}
<View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 20 }}>
  {images.slice(2, 4).map(({ id, uri }) => (
    <TouchableOpacity key={id} onPress={() => handleSelect(id)}>
      <Image
        source={{ uri }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 8,
          borderWidth: 4,
          borderColor: selected[id as keyof typeof selected] ? "#1c3519" : "#7e7e7e",
        }}
      />
    </TouchableOpacity>
  ))}
</View>


      <View style={{ alignSelf: "flex-start", marginBottom: 10 }}>
        <Text style={{ color: "#7e7e7e", fontSize: 12, fontWeight: "normal", marginTop: 30, textAlign: "left"  }}>
          한 개 이상 선택
        </Text>
      </View>
      
      {/* 다음 버튼 */}



<TouchableOpacity
        style={[
          styles.nextButtonBase,
          canProceed ? styles.nextButtonActive : styles.nextButtonDisabled,
          !canProceed && styles.nextButtonDisabled,
          styles.nextButtonFixed,
        ]}
        onPress={() => router.replace("/(tabs)")}
        disabled={!canProceed}
      >
        <Text style={styles.nextButtonText}>다음으로 넘어가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20, // 좌우 여백 추가
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  categoryButtonContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 100, // 버튼과 다음 버튼 사이 여백 증가
  },
  categoryButtonBase: {
    borderWidth: 2,
    borderColor: "#d2d2d2", // 항상 같은 테두리 색상
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120, // 버튼 최소 너비 설정으로 일관성 유지
  },
  categoryButtonSelected: {
    borderColor: "#234024",
  },
  categoryButtonUnselected: {
    backgroundColor: "#white",
  },
  categoryTextBase: {
    fontSize: 18,
  },
  categoryTextSelected: {
    color: "#1c3519",
  },
  categoryTextUnselected: {
    color: "#d2d2d2",
  },
    nextButtonBase: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200, // 조금 더 넉넉하게
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
