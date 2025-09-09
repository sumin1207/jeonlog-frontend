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
  });

  // 환경변수에서 API 키 가져오기
  const apiKey = getNaverMapApiKey();

  // 컴포넌트 렌더링 시작 로그
  console.log("🗺️ NaverMap 컴포넌트 렌더링 시작");
  console.log("🔑 API Key:", apiKey);
  console.log("📍 위치:", { latitude, longitude });
  console.log("🏷️ 제목:", title);

  // API 키가 없으면 간단한 메시지 표시
  if (!apiKey) {
    console.warn("⚠️ API 키가 없습니다");
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}>
        <Text
          style={{
            color: theme === "dark" ? "#ccc" : "#666",
            textAlign: "center",
          }}>
          네이버맵 API 키가 설정되지 않았습니다.
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

  // 웹 환경 감지
  const isWeb =
    typeof window !== "undefined" &&
    window.location.protocol.startsWith("http");

  // 웹 환경에서 간단한 테스트용 HTML
  const simpleTestHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Naver Map Test</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f0f0f0; }
        .test-container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .test-title { color: #007AFF; font-size: 20px; font-weight: bold; margin-bottom: 15px; }
        .test-info { margin: 10px 0; font-size: 14px; }
        .test-button { background: #007AFF; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin: 10px; cursor: pointer; font-size: 14px; }
        .error { color: #e74c3c; font-weight: bold; }
        .success { color: #27ae60; font-weight: bold; }
    </style>
</head>
<body>
    <div class="test-container">
        <div class="test-title">🗺️ 네이버 지도 API 테스트</div>
        <div class="test-info">📍 위치: ${latitude}, ${longitude}</div>
        <div class="test-info">🏷️ 제목: ${title}</div>
        <div class="test-info">🔑 API Key: ${apiKey}</div>
        <div class="test-info">🌐 현재 URL: <span id="currentUrl">로딩 중...</span></div>
        <div class="test-info">⏰ 시간: <span id="time">로딩 중...</span></div>
        
        <button class="test-button" onclick="testNaverAPI()">네이버 API 테스트</button>
        <button class="test-button" onclick="testDirectAPI()">직접 API 호출</button>
        
        <div id="result" style="margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 5px; min-height: 100px;">
            <div>테스트 결과가 여기에 표시됩니다...</div>
        </div>
    </div>
    
    <script>
        // 현재 URL 표시
        document.getElementById('currentUrl').textContent = window.location.href;
        
        // 시간 업데이트
        function updateTime() {
            const now = new Date();
            document.getElementById('time').textContent = now.toLocaleTimeString();
        }
        setInterval(updateTime, 1000);
        updateTime();
        
        function logResult(message, isError = false) {
            const resultEl = document.getElementById('result');
            const div = document.createElement('div');
            div.innerHTML = '<div class="' + (isError ? 'error' : 'success') + '">' + new Date().toLocaleTimeString() + ': ' + message + '</div>';
            resultEl.appendChild(div);
        }
        
        function testNaverAPI() {
            logResult('네이버 API 테스트 시작...');
            
            if (typeof naver === 'undefined') {
                logResult('❌ naver 객체가 없습니다. API가 로드되지 않았습니다.', true);
                return;
            }
            
            if (!naver.maps) {
                logResult('❌ naver.maps 객체가 없습니다.', true);
                return;
            }
            
            logResult('✅ naver.maps 객체 확인됨');
            
            try {
                const map = new naver.maps.Map('result', {
                    center: new naver.maps.LatLng(${latitude}, ${longitude}),
                    zoom: 15
                });
                logResult('✅ 지도 생성 성공!');
            } catch (error) {
                logResult('❌ 지도 생성 실패: ' + error.message, true);
            }
        }
        
        function testDirectAPI() {
            logResult('직접 API 호출 테스트 시작...');
            
            const script = document.createElement('script');
            script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${apiKey}';
            script.onload = function() {
                logResult('✅ API 스크립트 로드 성공');
                testNaverAPI();
            };
            script.onerror = function() {
                logResult('❌ API 스크립트 로드 실패', true);
            };
            document.head.appendChild(script);
        }
        
        // 페이지 로드 시 자동 테스트
        window.addEventListener('load', function() {
            logResult('페이지 로드 완료');
            setTimeout(testDirectAPI, 1000);
        });
    </script>
</body>
</html>
`;

  // 네이버맵 HTML 템플릿
  const mapHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Naver Map</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, sans-serif; 
            background: #f0f0f0; 
            overflow: hidden;
        }
        #map { 
            width: 100%; 
            height: 100vh; 
            position: relative;
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
            z-index: 1000;
        }
        .error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #e74c3c;
            z-index: 1000;
            padding: 20px;
        }
        .web-notice {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1001;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="loading" class="loading">
        <div>지도 로딩 중...</div>
    </div>
    ${
      isWeb
        ? '<div class="web-notice">웹 환경에서 실행 중 - 네이버 지도 API 도메인 설정을 확인해주세요</div>'
        : ""
    }
    
    <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${apiKey}" onload="console.log('✅ 네이버 지도 API 스크립트 로드 완료')" onerror="console.error('❌ 네이버 지도 API 스크립트 로드 실패')"></script>
    <script>
        console.log('🗺️ 네이버 지도 스크립트 시작');
        console.log('📍 위치:', ${latitude}, ${longitude});
        console.log('🏷️ 제목:', '${title}');
        console.log('🔑 API Key:', '${apiKey}');
        console.log('🌐 웹 환경:', ${isWeb});

        // React Native WebView와 통신하는 함수
        function sendMessage(message) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(message);
            } else {
                // 웹 환경에서는 콘솔에만 출력
                console.log('WebView Message:', message);
            }
        }

        // console.log 오버라이드
        (function() {
            const origLog = console.log;
            console.log = function(...args) {
                origLog.apply(console, args);
                sendMessage('webviewLog:' + JSON.stringify(args));
            };
        })();

        let map = null;
        let marker = null;
        let infoWindow = null;

        // 지도 초기화 함수
        function initMap() {
            try {
                console.log('🗺️ 네이버 지도 초기화 시작');
                
                // 지도 생성
                map = new naver.maps.Map('map', {
                    center: new naver.maps.LatLng(${latitude}, ${longitude}),
                    zoom: 15,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: naver.maps.MapTypeControlStyle.BUTTON,
                        position: naver.maps.Position.TOP_RIGHT
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        style: naver.maps.ZoomControlStyle.SMALL,
                        position: naver.maps.Position.RIGHT_CENTER
                    }
                });

                // 마커 생성
                marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(${latitude}, ${longitude}),
                    map: map,
                    title: '${title}'
                });

                // 정보창 생성
                infoWindow = new naver.maps.InfoWindow({
                    content: '<div style="padding: 10px; font-size: 14px; line-height: 1.4;"><strong>${title}</strong><br>${
    address || ""
  }</div>'
                });

                // 마커 클릭 이벤트
                naver.maps.Event.addListener(marker, 'click', function() {
                    if (infoWindow.getMap()) {
                        infoWindow.close();
                    } else {
                        infoWindow.open(map, marker);
                    }
                });

                // 지도 클릭 이벤트
                naver.maps.Event.addListener(map, 'click', function() {
                    infoWindow.close();
                });

                // 로딩 완료 처리
                setTimeout(function() {
                    document.getElementById('loading').style.display = 'none';
                    console.log('✅ 네이버 지도 로딩 완료');
                    sendMessage('naverAPILoaded:지도 로딩 완료');
                }, 1000);

            } catch (error) {
                console.error('❌ 네이버 지도 초기화 실패:', error);
                const loadingEl = document.getElementById('loading');
                if (loadingEl) {
                    loadingEl.innerHTML = '<div class="error">지도를 불러올 수 없습니다.<br>API 키를 확인해주세요.<br><br>웹 환경에서는 네이버 클라우드 플랫폼에서<br>도메인 설정을 확인해주세요.</div>';
                }
                sendMessage('naverAPIError:' + error.message);
            }
        }

        // 네이버 지도 API 로드 완료 이벤트
        naver.maps.onJSContentLoaded = initMap;

        // API 로딩 상태 확인
        console.log('🔍 naver.maps 객체 확인:', typeof naver !== 'undefined' ? '존재' : '없음');
        console.log('🔍 naver.maps.onJSContentLoaded:', typeof naver.maps.onJSContentLoaded);
        
        // API 로딩 실패 시 대체 방법
        setTimeout(function() {
            if (typeof naver === 'undefined' || !naver.maps) {
                console.error('❌ 네이버 지도 API 로드 실패 - naver 객체가 없음');
                const loadingEl = document.getElementById('loading');
                if (loadingEl) {
                    loadingEl.innerHTML = '<div class="error">네이버 지도 API를 불러올 수 없습니다.<br><br>API 키: ' + '${apiKey}' + '<br>현재 URL: ' + window.location.href + '<br><br>네이버 클라우드 플랫폼에서 도메인을 등록해주세요.</div>';
                }
                sendMessage('naverAPIError:API 객체 없음');
            }
        }, 3000);

        // 페이지 로드 완료 이벤트
        window.addEventListener('load', function() {
            console.log('📄 페이지 로드 완료');
            sendMessage('pageLoaded:페이지 로드 완료');
        });

        // DOM 로드 완료 이벤트
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 DOM 로드 완료');
            sendMessage('domLoaded:DOM 로드 완료');
        });

        // 에러 처리
        window.addEventListener('error', function(e) {
            console.error('❌ 페이지 에러:', e.error);
            sendMessage('pageError:' + e.error.message);
        });

        // 네이버 지도 API 로드 실패 처리
        window.addEventListener('unhandledrejection', function(e) {
            console.error('❌ 네이버 지도 API 로드 실패:', e.reason);
            sendMessage('naverAPIError:' + e.reason);
        });

        // 웹 환경에서 추가 에러 처리
        if (${isWeb}) {
            // 네이버 지도 API 로드 실패 감지
            setTimeout(function() {
                if (!map) {
                    console.error('❌ 네이버 지도 API 로드 타임아웃');
                    const loadingEl = document.getElementById('loading');
                    if (loadingEl) {
                        loadingEl.innerHTML = '<div class="error">네이버 지도 API를 불러올 수 없습니다.<br><br>가능한 원인:<br>1. API 키가 올바르지 않음<br>2. 도메인이 등록되지 않음<br>3. 네트워크 연결 문제<br><br>현재 URL: ' + window.location.href + '<br>API 키: ${apiKey}</div>';
                    }
                    sendMessage('naverAPIError:API 로드 타임아웃');
                }
            }, 5000);

            // 네이버 지도 API 로드 실패 시 대체 지도 표시
            setTimeout(function() {
                if (!map && typeof naver === 'undefined') {
                    console.log('🔄 대체 지도 표시 시도');
                    const mapEl = document.getElementById('map');
                    if (mapEl) {
                        mapEl.innerHTML = '<div style="width: 100%; height: 100%; background: #f0f0f0; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #666;"><div style="font-size: 18px; margin-bottom: 10px;">🗺️</div><div style="font-size: 16px; margin-bottom: 5px;">지도 서비스</div><div style="font-size: 14px; text-align: center; line-height: 1.4;">위치: ${title}<br>좌표: ${latitude}, ${longitude}<br><br>네이버 지도 API를 사용할 수 없습니다.<br>도메인 설정을 확인해주세요.</div></div>';
                    }
                }
            }, 6000);
        }
    </script>
</body>
</html>
`;
  const handleMessage = (event: any) => {
    try {
      const { data } = event.nativeEvent;
      console.log("📨 WebView 메시지 수신:", data);

      if (data.startsWith("naverAPILoaded:")) {
        console.log("✅ 네이버 API 로드 완료 메시지 수신:", data);
      } else if (data.startsWith("naverAPIError:")) {
        console.log("❌ 네이버 API 에러 메시지 수신:", data);
      } else if (data.startsWith("pageError:")) {
        console.log("❌ 페이지 에러 메시지 수신:", data);
      } else if (data.startsWith("pageLoaded:")) {
        console.log("📄 페이지 로드 완료 메시지 수신:", data);
      } else if (data.startsWith("domLoaded:")) {
        console.log("📄 DOM 로드 완료 메시지 수신:", data);
      } else if (data.startsWith("webviewLog:")) {
        // WebView 로그는 콘솔에만 출력
        const logData = data.replace("webviewLog:", "");
        try {
          const logArgs = JSON.parse(logData);
          console.log("🌐 WebView Log:", ...logArgs);
        } catch (e) {
          console.log("🌐 WebView Log:", logData);
        }
      } else {
        console.log("📝 기타 WebView 메시지:", data);
      }
    } catch (error) {
      console.error("Message handling error:", error);
    }
  };

  const handleError = (error: any) => {
    console.error("❌ WebView Error:", error);
  };

  const handleHttpError = (error: any) => {
    console.error("❌ HTTP Error:", error);
  };

  const handleLoadStart = () => {
    console.log("🔄 WebView 로딩 시작");
  };

  const handleLoadEnd = () => {
    console.log("✅ WebView 로딩 완료");
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ html: isWeb ? simpleTestHTML : mapHTML }}
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
        }}
        onRenderProcessGone={() => {
          console.log("❌ WebView 렌더링 프로세스 종료됨");
        }}
      />
    </View>
  );
}
