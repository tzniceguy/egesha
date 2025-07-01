import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.gradientBackground}
      >
        <View style={styles.contentContainer}>
          {/* Image/Logo Container */}
          <View style={styles.imageContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🚗</Text>
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Egesha</Text>
            <Text style={styles.subtitle}>
              Travel, move - let us think about parking
            </Text>
          </View>

          {/* Button Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              activeOpacity={0.8}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              activeOpacity={0.8}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  imageContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 50,
  },
  titleContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "300",
  },
  buttonContainer: {
    flex: 0.3,
    width: "100%",
    justifyContent: "center",
    gap: 15,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: "#fff",
  },
  registerButtonText: {
    color: "#667eea",
    fontSize: 18,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flex: 0.1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default AuthScreen;
