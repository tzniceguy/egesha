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
import { RegisterSchema } from "@/utils/validators/form-validators";
import Input from "@/components/auth/input";
import PasswordInput from "@/components/auth/password-input";

const RegisterScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
  });

  type ErrorState = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    password?: string;
  };
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const results = RegisterSchema.safeParse(formData);

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

  const handleRegistration = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/verify-otp");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Enter your details to get started with ParkEasy
            </Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <Input
              label="First Name"
              iconName="person-outline"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(text) => updateFormData("firstName", text)}
              error={errors.firstName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Input
              label="Last Name"
              iconName="person-outline"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(text) => updateFormData("lastName", text)}
              error={errors.lastName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <Input
              label="Phone Number"
              iconName="call-outline"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChangeText={(text) => updateFormData("phoneNumber", text)}
              error={errors.phoneNumber}
              keyboardType="phone-pad"
              autoCorrect={false}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter a strong password"
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
              error={errors.password}
              autoCorrect={false}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleRegistration}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.submitButtonText}>
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
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
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
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
  termsContainer: {
    marginTop: 24,
    paddingBottom: 40,
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: {
    color: "#667eea",
    fontWeight: "600",
  },
});

export default RegisterScreen;
