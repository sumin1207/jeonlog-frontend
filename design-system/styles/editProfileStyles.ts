import { StyleSheet } from "react-native";
import { Colors } from "../theme";

export const editProfileStyles = StyleSheet.create({
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
