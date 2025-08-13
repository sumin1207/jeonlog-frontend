import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import WebView from "react-native-webview";
import { useTheme } from "@/contexts/ThemeContext";
import { getNaverMapApiKey } from "@/constants/Config";

interface NaverMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get("window");

export default function NaverMap({
  latitude,
  longitude,
  title = "위치",
  address = "",
  width = screenWidth - 40,
  height = 200,
}: NaverMapProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // 스타일 정의를 먼저 선언
  const styles = StyleSheet.create({
    container: {
      width,
      height,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f5f5f5",
      position: "relative",
    },
    webview: {
      flex: 1,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f5f5f5",
      zIndex: 1,
    },
    errorContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f5f5f5",
      zIndex: 1,
    },
    errorText: {
      color: theme === "dark" ? "#ff6b6b" : "#e74c3c",
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 20,
    },
  });

  // 환경변수에서 API 키 가져오기
  const apiKey = getNaverMapApiKey();

  // 컴포넌트 렌더링 시작 로그
  console.log("🗺️ NaverMap 컴포넌트 렌더링 시작");
  console.log("🔑 API Key:", apiKey);
  console.log("📍 위치:", { latitude, longitude });
  console.log("🏷️ 제목:", title);

  // API 키가 없으면 에러 상태로 설정
  if (!apiKey) {
    console.warn("⚠️ API 키가 없어서 에러 화면을 표시합니다");
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}>
        <Text style={styles.errorText}>
          네이버맵 API 키가 설정되지 않았습니다.{"\n"}
          .env 파일에 NAVER_CLIENT_ID를 설정해주세요.{"\n"}
          {"\n"}
          현재 API 키: {apiKey || "없음"}
        </Text>
      </View>
    );
  }

  // API 키 디버깅
  console.log("🔑 NaverMap API Key:", apiKey);
  console.log("📍 위치:", { latitude, longitude });
  console.log("🏷️ 제목:", title);
  console.log(
    "🌐 네이버맵 URL:",
    `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${apiKey}`
  );

  // 네이버맵 HTML 템플릿
  const mapHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Simple Test</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f0f0f0; text-align: center; }
        .test-box { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px; }
        .test-title { color: #007AFF; font-size: 20px; font-weight: bold; margin-bottom: 15px; }
        .test-info { margin: 10px 0; font-size: 14px; }
        .test-button { background: #007AFF; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 10px; cursor: pointer; font-size: 14px; }
    </style>
</head>
<body>
    <div class="test-box">
        <div class="test-title">🌐 WebView 테스트</div>
        <div class="test-info">📍 위치: ${latitude}, ${longitude}</div>
        <div class="test-info">🏷️ 제목: ${title}</div>
        <div class="test-info">🔑 API Key: ${apiKey}</div>
        <div class="test-info">⏰ 시간: <span id="time">로딩 중...</span></div>
        
        <button class="test-button" onclick="sendMessage()">메시지 전송</button>
        <button class="test-button" onclick="checkWebView()">WebView 확인</button>
    </div>
    
    <script>
        // 🔹 console.log를 오버라이드하여 RN으로 전달
        (function() {
            const origLog = console.log;
            console.log = function(...args) {
                origLog.apply(console, args);
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage('webviewLog:' + JSON.stringify(args));
                }
            };
        })();

        console.log('🌐 간단한 테스트 스크립트 시작');

        // 시간 업데이트
        function updateTime() {
            const now = new Date();
            document.getElementById('time').textContent = now.toLocaleTimeString();
        }
        setInterval(updateTime, 1000);
        updateTime();

        function sendMessage() {
            console.log('📝 메시지 전송 버튼 클릭됨');
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('simpleMessage:테스트 메시지 전송됨');
                alert('메시지 전송 성공!');
            } else {
                alert('ReactNativeWebView 객체를 찾을 수 없음');
            }
        }

        function checkWebView() {
            console.log('🔍 WebView 상태 확인');
            const status = {
                hasReactNativeWebView: !!window.ReactNativeWebView,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };
            console.log('📊 WebView 상태:', status);
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('webViewStatus:' + JSON.stringify(status));
                alert('WebView 정상 작동 중');
            } else {
                alert('WebView 연결 실패');
            }
        }

        window.addEventListener('load', function() {
            console.log('📄 페이지 로드 완료');
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('pageLoaded:간단한 테스트 페이지 로드 완료');
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 DOM 로드 완료');
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('domLoaded:DOM 로드 완료');
            }
        });
    </script>
</body>
</html>
`;
  const handleMessage = (event: any) => {
    try {
      const { data } = event.nativeEvent;
      console.log("📨 WebView 메시지 수신:", data);

      if (data === "mapLoaded") {
        console.log("✅ 지도 로딩 완료 메시지 수신");
        setIsLoading(false);
        setHasError(false);
      } else if (data.startsWith("mapError:")) {
        console.log("❌ 지도 에러 메시지 수신:", data);
        setIsLoading(false);
        setHasError(true);
        console.error("NaverMap Error:", data);
      } else if (data.startsWith("simpleMessage:")) {
        console.log("🧪 간단한 테스트 메시지 수신:", data);
        // 테스트 메시지는 로딩 상태를 변경하지 않음
      } else if (data.startsWith("webViewStatus:")) {
        console.log("🔍 WebView 상태 메시지 수신:", data);
        const status = data.replace("webViewStatus:", "");
        try {
          const statusObj = JSON.parse(status);
          console.log("📊 WebView 상태 상세:", statusObj);
        } catch (e) {
          console.log("📊 WebView 상태 (파싱 실패):", status);
        }
      } else if (data.startsWith("pageLoaded:")) {
        console.log("📄 페이지 로드 완료 메시지 수신:", data);
        // 페이지 로드 완료 시 로딩 상태 업데이트
        setTimeout(() => {
          if (isLoading) {
            console.log("✅ WebView 페이지 로드 완료, 로딩 상태 해제");
            setIsLoading(false);
          }
        }, 2000); // 2초 후 로딩 상태 해제
      } else if (data.startsWith("domLoaded:")) {
        console.log("📄 DOM 로드 완료 메시지 수신:", data);
      } else if (data.startsWith("naverAPILoaded:")) {
        console.log("✅ 네이버 API 로드 완료 메시지 수신:", data);
        setIsLoading(false);
        setHasError(false);
      } else if (data.startsWith("naverAPIError:")) {
        console.log("❌ 네이버 API 에러 메시지 수신:", data);
        setIsLoading(false);
        setHasError(true);
      } else {
        console.log("📝 기타 WebView 메시지:", data);
      }
    } catch (error) {
      console.error("Message handling error:", error);
    }
  };

  const handleError = (error: any) => {
    console.error("❌ WebView Error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleHttpError = (error: any) => {
    console.error("❌ HTTP Error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleLoadStart = () => {
    console.log("🔄 WebView 로딩 시작");
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    console.log("✅ WebView 로딩 완료, 네이버맵 API 대기 시작");
    // WebView 로딩 완료 후 15초 대기 (네이버맵 API 로딩 시간 고려)
    setTimeout(() => {
      if (isLoading) {
        console.log("⏰ 네이버맵 로딩 타임아웃 (15초)");
        setIsLoading(false);
        setHasError(true);
      }
    }, 15000);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ html: mapHTML }}
        // 기본 설정만 사용
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        // 추가 설정 제거
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        startInLoadingState={false}
        // 디버깅을 위한 추가 설정
        onContentProcessDidTerminate={() => {
          console.log("❌ WebView 프로세스 종료됨");
          setHasError(true);
        }}
        onRenderProcessGone={() => {
          console.log("❌ WebView 렌더링 프로세스 종료됨");
          setHasError(true);
        }}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size='large'
            color={theme === "dark" ? "#fff" : "#000"}
          />
          <Text
            style={{
              marginTop: 10,
              color: theme === "dark" ? "#ccc" : "#666",
            }}>
            지도 로딩 중...
          </Text>
        </View>
      )}

      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            지도를 불러올 수 없습니다.{"\n"}
            네이버맵 API 인증을 확인해주세요.{"\n"}
            잠시 후 다시 시도해주세요.
          </Text>
        </View>
      )}
    </View>
  );
}
