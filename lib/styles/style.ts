import { StyleSheet } from "react-native";
import colors from "./colors";

export const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 744,
    left: 20,
    width: 350,
    height: 52,
    paddingHorizontal: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400",
    color: "#FFFFFF",
    backgroundColor: colors.primary,
    opacity: 1,
    borderWidth: 0,
    borderRadius: 10,
  },
  buttonHover: {
    color: "#FFFFFF",
    backgroundColor: "#3E8C40",
  },
  buttonPressed: {
    color: "#FFFFFF",
    backgroundColor: "#316F33",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
