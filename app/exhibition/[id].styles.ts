import { StyleSheet } from "react-native";

export const style = (theme: string) =>

StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
  },
  imageContainer: {
    width: "100%",
    height: 400,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  posterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    padding: 20,
  },

  titleSection: {
    marginBottom: 30,
    color: theme === "dark" ? "#ffffff" : "#000000",
    fontWeight: "bold",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: theme === "dark" ? "#ffffff" : "#000",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 15,
    padding: 8,
  },
  categoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 30,
  },
  descriptionSection: {
    marginBottom: 30,
  },
  additionalSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: theme === "dark" ? "#ccc" : "#000000",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
  },
  explanationImageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  recordButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#1c3519",
    borderRadius: 20,
    marginTop: 10,
  },
});
