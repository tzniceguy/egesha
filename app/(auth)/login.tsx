import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LoginSchema } from "@/utils/validators/form-validators";
import Input from "@/components/auth/input";
import PasswordInput from "@/components/auth/password-input";
import { useAuthStore } from "@/stores/auth";
import { ActivityIndicator } from "react-native";
import { formatToInternational } from "@/utils/format/input";

const LoginScreen = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  type ErrorState = {
    phoneNumber?: string;
    password?: string;
  };
  const [errors, setErrors] = useState<ErrorState>({});

  const validateForm = () => {
    const results = LoginSchema.safeParse(formData);

    if (results.success) {
      setErrors({});
      return true;
    } else {
      const fieldErrors: ErrorState = {};
      results.error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          fieldErrors[err.path[0] as keyof ErrorState] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        phone_number: formData.phoneNumber,
        password: formData.password,
      };

      await login(payload);
    } catch (error) {
      Alert.alert("Login Failed", "Invalid phone number or password.");
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ErrorState]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.titleContainer}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome Back!</Text>
            </View>
            
            <Text style={styles.headerSubtitle}>
              Enter your credentials to access your account
            </Text>

          </View>

          <View style={styles.formContainer}>
            <Input
              label="Phone Number"
              iconName="call-outline"
              placeholder="+255712345678"
              value={formData.phoneNumber}
              onChangeText={(text) => {
                const formatted = formatToInternational(text);
                updateFormData("phoneNumber", formatted);
              }}
              error={errors.phoneNumber}
              keyboardType="phone-pad"
              autoCorrect={false}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
              error={errors.password}
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              accessibilityLabel="Sign In button"
              accessibilityRole="button"
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.submitButtonText}>Signing In...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/register")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    lineHeight: 22,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerContainer: {
    marginTop: 32,
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  footerLink: {
    color: "#667eea",
    fontWeight: "600",
  },
});

export default LoginScreen;
