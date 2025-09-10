import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Text as RNText,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button } from "../../design-system";
import { Colors } from "../../design-system/theme";
import { followService, User } from "../../services/followService";

interface FollowModalProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
}

export default function FollowModal({
  visible,
  onClose,
  userName,
}: FollowModalProps) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  // 모달이 열릴 때 데이터 로드
  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [followersResponse, followingResponse] = await Promise.all([
        followService.getFollowers(),
        followService.getFollowing(),
      ]);

      if (followersResponse.success) {
        setFollowers(followersResponse.data || []);
      } else {
        console.error("팔로워 로드 실패:", followersResponse.message);
        if (followersResponse.message?.includes("인증이 필요합니다")) {
          Alert.alert("인증 오류", "다시 로그인해주세요.", [
            { text: "확인", onPress: () => onClose() },
          ]);
          return;
        }
        Alert.alert("오류", "팔로워 목록을 불러올 수 없습니다.");
      }

      if (followingResponse.success) {
        setFollowing(followingResponse.data || []);
      } else {
        console.error("팔로잉 로드 실패:", followingResponse.message);
        if (followingResponse.message?.includes("인증이 필요합니다")) {
          Alert.alert("인증 오류", "다시 로그인해주세요.", [
            { text: "확인", onPress: () => onClose() },
          ]);
          return;
        }
        Alert.alert("오류", "팔로잉 목록을 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      Alert.alert("오류", "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    const user = following.find((u) => u.id === userId);
    if (!user) return;

    setFollowLoading(userId);

    try {
      let response;
      if (user.isFollowing) {
        response = await followService.unfollowUser(userId);
      } else {
        response = await followService.followUser(userId);
      }

      if (response.success) {
        // 로컬 상태 업데이트
        setFollowing((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u
          )
        );
      } else {
        if (response.message?.includes("인증이 필요합니다")) {
          Alert.alert("인증 오류", "다시 로그인해주세요.", [
            { text: "확인", onPress: () => onClose() },
          ]);
          return;
        }
        Alert.alert("오류", response.message || "요청을 처리할 수 없습니다.");
      }
    } catch (error) {
      console.error("팔로우 토글 오류:", error);
      Alert.alert("오류", "요청을 처리하는 중 오류가 발생했습니다.");
    } finally {
      setFollowLoading(null);
    }
  };

  const renderUserItem = (user: User) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        {user.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons
              name='person'
              size={20}
              color='#666'
            />
          </View>
        )}
        <View style={styles.userDetails}>
          <Text
            variant='body'
            style={styles.userName}>
            {user.name}
          </Text>
          {user.bio && (
            <Text
              variant='caption'
              color='secondary'
              style={styles.userBio}>
              {user.bio}
            </Text>
          )}
        </View>
      </View>
      {activeTab === "following" && (
        <TouchableOpacity
          style={[
            styles.followButton,
            user.isFollowing ? styles.followingButton : styles.followButton,
          ]}
          onPress={() => handleFollowToggle(user.id)}
          disabled={followLoading === user.id}>
          {followLoading === user.id ? (
            <ActivityIndicator
              size='small'
              color='#fff'
            />
          ) : (
            <Text
              variant='caption'
              style={
                user.isFollowing
                  ? styles.followingButtonText
                  : styles.followButtonText
              }>
              {user.isFollowing ? "팔로잉" : "팔로우"}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const currentData = activeTab === "followers" ? followers : following;

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}>
            <Ionicons
              name='close'
              size={24}
              color='#000'
            />
          </TouchableOpacity>
          <Text
            variant='h3'
            style={styles.title}>
            {userName || "사용자"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "followers" && styles.activeTab]}
            onPress={() => setActiveTab("followers")}>
            <Text
              variant='body'
              style={
                activeTab === "followers"
                  ? styles.activeTabText
                  : styles.tabText
              }>
              팔로워 {followers.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "following" && styles.activeTab]}
            onPress={() => setActiveTab("following")}>
            <Text
              variant='body'
              style={
                activeTab === "following"
                  ? styles.activeTabText
                  : styles.tabText
              }>
              팔로잉 {following.length}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator
                size='large'
                color={Colors.primary.main}
              />
              <Text
                variant='body'
                color='secondary'
                style={styles.loadingText}>
                로딩 중...
              </Text>
            </View>
          ) : currentData.length > 0 ? (
            currentData.map((user) => (
              <View key={user.id}>
                {renderUserItem(user)}
                <View style={styles.separator} />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name='people-outline'
                size={48}
                color='#ccc'
              />
              <Text
                variant='body'
                color='secondary'
                style={styles.emptyText}>
                {activeTab === "followers"
                  ? "팔로워가 없습니다"
                  : "팔로잉한 사용자가 없습니다"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontWeight: "600" as const,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center" as const,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary.main,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  activeTabText: {
    color: Colors.primary.main,
    fontWeight: "600" as const,
  },
  content: {
    flex: 1,
  },
  userItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: "500" as const,
    marginBottom: 2,
  },
  userBio: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.primary.main,
  },
  followingButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500" as const,
  },
  followingButtonText: {
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 68,
  },
  emptyState: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
  },
  loadingState: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
  },
};
