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
import { editProfileStyles } from "@/design-system/styles/editProfileStyles";

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

    Alert.alert("", "프로필이 성공적으로 업데이트 되었습니다!");
    router.back();
  };

  if (isLoading) {
    return (
      <Container style={editProfileStyles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </Container>
    );
  }

  if (!userInfo) {
    return (
      <Container style={editProfileStyles.centeredContainer}>
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
    <Container variant="safe" style={editProfileStyles.container}>
      <View style={editProfileStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>취소</Text>
        </TouchableOpacity>
        <Text variant="h3">프로필 수정</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={editProfileStyles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={editProfileStyles.avatarContainer}>
          <TouchableOpacity onPress={handleChangePhotoPress}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={editProfileStyles.avatar} />
            ) : (
              <View style={[editProfileStyles.avatar, editProfileStyles.avatarPlaceholder]}>
                <Ionicons name="person" size={60} color="#666" />
              </View>
            )}
            <Text style={editProfileStyles.changePhotoText}>프로필 사진 변경</Text>
          </TouchableOpacity>
        </View>

        <View style={editProfileStyles.form}>
          <View style={editProfileStyles.inputContainer}>
            <Text style={editProfileStyles.label}>닉네임</Text>
            <TextInput
              style={editProfileStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="닉네임을 입력하세요"
            />
          </View>
          <View style={editProfileStyles.inputContainer}>
            <Text style={editProfileStyles.label}>한줄 소개</Text>
            <TextInput
              style={editProfileStyles.input}
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
