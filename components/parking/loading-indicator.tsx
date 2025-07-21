
import React from "react";
import {
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";

export default function LoadingIndicator() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </SafeAreaView>
  );
}
