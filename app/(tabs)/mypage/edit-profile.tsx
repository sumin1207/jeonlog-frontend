import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/components/context/AuthContext";
import { Container, Text } from "@/design-system";
import { Colors } from "@/design-system/theme";

const USER_PROFILE_EXTENDED_KEY = "user_profile_extended";

export default function EditProfileScreen() {
  const router = useRouter();
  const { userInfo, setUserInfo, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (userInfo) {
        // Initialize name from context
        setName(userInfo.name || "");

        // Load extended profile from storage
        const key = `${USER_PROFILE_EXTENDED_KEY}_${userInfo.id}`;
        const savedProfileJson = await AsyncStorage.getItem(key);
        if (savedProfileJson) {
          const savedProfile = JSON.parse(savedProfileJson);
          setBio(savedProfile.bio || "");
          setAvatar(savedProfile.avatar || null);
        }
      }
    };
    if (!isLoading) {
      loadProfileData();
    }
  }, [userInfo, isLoading]);

  const launchImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant permission to access photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleChangePhotoPress = () => {
    Alert.alert(
      "프로필 사진 변경",
      "",
      [
        {
          text: "갤러리에서 선택",
          onPress: launchImagePicker,
        },
        {
          text: "기본 이미지로 변경",
          onPress: () => setAvatar(null),
          style: "destructive",
        },
        {
          text: "취소",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    if (!userInfo) {
      Alert.alert("Error", "You must be logged in to save your profile.");
      return;
    }

    setUserInfo({ ...userInfo, name });

    const key = `${USER_PROFILE_EXTENDED_KEY}_${userInfo.id}`;
    const extendedProfile = { bio, avatar };
    await AsyncStorage.setItem(key, JSON.stringify(extendedProfile));

    Alert.alert("Profile Updated", "Your profile has been successfully updated.");
    router.back();
  };

  if (isLoading) {
    return (
      <Container style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </Container>
    );
  }

  if (!userInfo) {
    return (
      <Container style={styles.centeredContainer}>
        <Text>You must be logged in to edit your profile.</Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={{ color: Colors.primary.main, marginTop: 16 }}>
            Go to Login
          </Text>
        </TouchableOpacity>
      </Container>
    );
  }

  return (
    <Container variant="safe" style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>취소</Text>
        </TouchableOpacity>
        <Text variant="h3">프로필 수정</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleChangePhotoPress}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={60} color="#666" />
              </View>
            )}
            <Text style={styles.changePhotoText}>프로필 사진 변경</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="닉네임을 입력하세요"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>한줄 소개</Text>
            <TextInput
              style={styles.input}
              value={bio}
              onChangeText={setBio}
              placeholder="한줄 소개를 입력하세요"
              maxLength={150}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8, // Keep a smaller padding for aesthetics
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  saveText: {
    color: Colors.primary.main,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.neutral.gray200,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    color: Colors.primary.main,
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: Colors.text.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
