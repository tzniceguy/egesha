import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InputProps = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

const Input = ({
  label,
  iconName,
  error,
  containerStyle,
  style,
  ...rest
}: InputProps) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Ionicons
          name={iconName}
          size={20}
          color="#666"
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#aaa"
          {...rest}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: "#ff4757",
    backgroundColor: "#fff5f5",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  errorText: {
    fontSize: 14,
    color: "#ff4757",
    marginTop: 6,
    marginLeft: 4,
  },
});

export default Input;
