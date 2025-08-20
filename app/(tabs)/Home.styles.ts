import { StyleSheet } from "react-native";

export const style = (theme: string) =>
    StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth:1,
    },
    content: {
      flex: 1,
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme === "dark" ? "#fff" : "#1c3519",
      textAlign: "left",
      alignSelf: "flex-start",
    },
    skeletonContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    skeletonItem: {
      width: "48%",
      marginBottom: 15,
    },
    // 탭 스타일
    tabContainer: {
      flexDirection: "row",
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme === "dark" ? "#333" : "#fff",
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
    },
    tabText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme === "dark" ? "#ccc" : "#666",
    },
    activeTabText: {
      color: theme === "dark" ? "#fff" : "#1c3519",
      fontWeight: "600",
    },
    activeTabIndicator: {
      position: "absolute",
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: "#1c3519",
    },
    // 연령대 필터 스타일
    ageFilterContainer: {
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    ageFilterScrollContainer: {
      paddingHorizontal: 0,
    },
    ageFilterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 1,
      borderColor: "#1c3519",
    },
    ageFilterButtonSelected: {
      backgroundColor: "#1c3519",
    },
    ageFilterButtonUnselected: {
      backgroundColor: "transparent",
    },
    ageFilterText: {
      fontSize: 14,
      fontWeight: "500",
    },
    ageFilterTextSelected: {
      color: "#fff",
    },
    ageFilterTextUnselected: {
      color: "#1c3519",
    },
    // 추천 카드 스타일
    recommendationCard: {

      marginBottom: 0,
      elevation: 5,
    borderBottomColor: "#ddd",
    borderBottomWidth:1,
    },
    cardContent: {
      flexDirection: "row",
      padding: 16,
    },
    imagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#333" : "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    cardTextContainer: {
      flex: 1,
      justifyContent: "center",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    cardLocation: {
      fontSize: 14,
      marginBottom: 2,
    },
    cardDate: {
      fontSize: 12,
    },
  });