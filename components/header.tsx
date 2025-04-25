import { View, Text, StyleSheet, SafeAreaView } from "react-native";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Header" }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default Header;
