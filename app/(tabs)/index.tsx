import { StyleSheet, View, Text } from "react-native";
import HorizontalSliding from "@/components/HorizontalSliding";

export default function IndexHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>요즘 뜨고 있는 전시</Text>
      <HorizontalSliding />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "condensed",
    marginBottom: 10,
  },
});
