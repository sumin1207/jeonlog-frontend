import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
const { width } = Dimensions.get("window");

//임시 추천 전시
const originalRecommnedations = [
  {
    id: "rec-1",
    title: "추천 1",
    imageUrl: "https://via.placeholder.com/300x200/FF5733/FFFFFF?text=rec-1",
  },
  {
    id: "rec-2",
    title: "추천 2",
    imageUrl: "https://via.placeholder.com/300x200/33FF57/FFFFFF?text=rec-2",
  },
  {
    id: "rec-3",
    title: "추천 3",
    imageUrl: "https://via.placeholder.com/300x200/3357FF/FFFFFF?text=rec-3",
  },
  {
    id: "rec-4",
    title: "추천 4",
    imageUrl: "https://via.placeholder.com/300x200/F0FF33/FFFFFF?text=4",
  },
  {
    id: "rec-5",
    title: "추천 5",
    imageUrl:
      "https://via.placeholder.com/300x200/FF33F0/FFFFFF?text=Exhibition+5",
  },
];

const RecommendForYou = () => {
  const {theme} = useTheme();
  const flatListRef=useRef<FlatList>(null);
  const itemWidth = width*0.8+20; //아이템 너비 + 마진
  const extendedRecommendations = [
    ...originalRecommnedations.slice(-2),
    ...originalRecommnedations,
    ...originalRecommnedations.slice(0,2),
  ];
  //초기 슬라이드 위치 설정

  

  return (
  
  );
};

export default RecommendForYou;
