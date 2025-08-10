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
import { getKakaoMapApiKey } from "@/constants/Config";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get("window");

export default function KakaoMap({
  latitude,
  longitude,
  title = "위치",
  address = "",
  width = screenWidth - 40,
  height = 200,
}: KakaoMapProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // 환경변수에서 API 키 가져오기
  const apiKey = getKakaoMapApiKey();

  // 카카오맵 HTML 템플릿
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Kakao Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}"></script>
        <style>
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
            }
            #map {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .info {
                position: absolute;
                top: 10px;
                left: 10px;
                background: ${
                  theme === "dark"
                    ? "rgba(42, 42, 42, 0.9)"
                    : "rgba(255, 255, 255, 0.9)"
                };
                padding: 8px 12px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                max-width: 200px;
                font-size: 12px;
                color: ${theme === "dark" ? "#fff" : "#333"};
                z-index: 1000;
            }
            .info-title {
                font-weight: bold;
                margin-bottom: 4px;
            }
            .info-address {
                font-size: 11px;
                color: ${theme === "dark" ? "#ccc" : "#666"};
            }
            .loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #666;
                font-size: 14px;
                z-index: 1001;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <div class="info">
            <div class="info-title">${title}</div>
            <div class="info-address">${address}</div>
        </div>
        <div class="loading" id="loading">지도 로딩 중...</div>
        
        <script>
            function initMap() {
                try {
                    var container = document.getElementById('map');
                    var options = {
                        center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                        level: 3
                    };
                    
                    var map = new kakao.maps.Map(container, options);
                    
                    var markerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
                    var marker = new kakao.maps.Marker({
                        position: markerPosition
                    });
                    marker.setMap(map);
                    
                    var infowindow = new kakao.maps.InfoWindow({
                        content: '<div style="padding:10px; font-size:12px; color:#333; font-weight:bold;">${title}</div>'
                    });
                    
                    kakao.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });
                    
                    var zoomControl = new kakao.maps.ZoomControl();
                    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
                    
                    var mapTypeControl = new kakao.maps.MapTypeControl();
                    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
                    
                    document.getElementById('loading').style.display = 'none';
                    
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage('mapLoaded');
                    }
                } catch (error) {
                    console.error('Map error:', error);
                    document.getElementById('loading').innerHTML = '지도 로딩 실패';
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage('mapError:' + error.message);
                    }
                }
            }
            
            function waitForKakao() {
                if (typeof kakao !== 'undefined' && kakao.maps) {
                    initMap();
                } else {
                    setTimeout(waitForKakao, 100);
                }
            }
            
            waitForKakao();
        </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const { data } = event.nativeEvent;
      if (data === "mapLoaded") {
        setIsLoading(false);
        setHasError(false);
      } else if (data.startsWith("mapError:")) {
        setIsLoading(false);
        setHasError(true);
        console.error("KakaoMap Error:", data);
      }
    } catch (error) {
      console.error("Message handling error:", error);
    }
  };

  const handleError = (error: any) => {
    console.error("WebView Error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleHttpError = (error: any) => {
    console.error("HTTP Error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    // WebView 로딩 완료 후 5초 대기
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000);
  };

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

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ html: mapHTML }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onMessage={handleMessage}
        onError={handleError}
        onHttpError={handleHttpError}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        startInLoadingState={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsProtectedMedia={true}
        onShouldStartLoadWithRequest={() => true}
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
            지도를 불러올 수 없습니다.{"\n"}잠시 후 다시 시도해주세요.
          </Text>
        </View>
      )}
    </View>
  );
}
