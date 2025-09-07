import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ServerConfigModalProps {
  visible: boolean;
  onClose: () => void;
  onServerChange: (serverUrl: string) => void;
  currentServerUrl: string;
}

const ServerConfigModal: React.FC<ServerConfigModalProps> = ({
  visible,
  onClose,
  onServerChange,
  currentServerUrl,
}) => {
  const [serverUrl, setServerUrl] = useState(currentServerUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!serverUrl.trim()) {
      Alert.alert("오류", "서버 URL을 입력해주세요.");
      return;
    }

    // URL 형식 검증
    try {
      new URL(serverUrl);
    } catch {
      Alert.alert("오류", "올바른 URL 형식을 입력해주세요.\n예: https://example.com");
      return;
    }

    setIsLoading(true);
    try {
      // 서버 URL 저장
      await AsyncStorage.setItem("custom_server_url", serverUrl.trim());
      
      // 서버 연결 테스트
      const testResponse = await fetch(`${serverUrl.trim()}/health`, {
        method: "GET",
        timeout: 5000,
      }).catch(() => null);

      if (testResponse && testResponse.ok) {
        Alert.alert(
          "성공",
          "서버 설정이 저장되었습니다.",
          [
            {
              text: "확인",
              onPress: () => {
                onServerChange(serverUrl.trim());
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "경고",
          "서버 URL이 저장되었지만 연결을 확인할 수 없습니다.\n\n계속하시겠습니까?",
          [
            { text: "취소", style: "cancel" },
            {
              text: "계속",
              onPress: () => {
                onServerChange(serverUrl.trim());
                onClose();
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "오류",
        "서버 설정 저장 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "기본값으로 재설정",
      "서버 URL을 기본값으로 재설정하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "재설정",
          onPress: async () => {
            const defaultUrl = "http://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com";
            setServerUrl(defaultUrl);
            await AsyncStorage.removeItem("custom_server_url");
            onServerChange(defaultUrl);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>서버 설정</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.description}>
            백엔드 서버 URL을 설정하세요. 기본값은 AWS Elastic Beanstalk 서버입니다.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>서버 URL</Text>
            <TextInput
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="https://your-server.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>💡 서버 설정 가이드</Text>
            <Text style={styles.infoText}>
              • 기본 서버: AWS Elastic Beanstalk{'\n'}
              • 로컬 개발: http://localhost:8080{'\n'}
              • 커스텀 서버: https://your-domain.com{'\n'}
              • 프로토콜(http/https)을 포함해주세요
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>기본값으로 재설정</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? "저장 중..." : "저장"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c3519",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
  },
  infoContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ServerConfigModal;
