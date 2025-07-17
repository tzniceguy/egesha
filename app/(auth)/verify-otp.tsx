import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { verifyOtp } from "@/services/auth";

const VerifyOTPScreen = () => {
  const router = useRouter();
  const { phone_number } = useLocalSearchParams<{ phone_number: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6 || !phone_number) {
      Alert.alert("Invalid OTP", "Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp({ phone_number, otp: otpString });
      Alert.alert("Success", "Phone number verified successfully!");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Verification Failed", "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    // Implement resend OTP logic here if available in the API
    setResendTimer(60);
    setCanResend(false);
    Alert.alert("OTP Sent", "A new OTP has been sent to your phone number.");
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={48} color="#667eea" />
            </View>
            <Text style={styles.title}>Verify Your Phone</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {phone_number}
            </Text>
          </View>

          <View style={styles.otpContainer}>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref!)}
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                (!isOtpComplete || isLoading) && styles.verifyButtonDisabled,
              ]}
              onPress={handleVerifyOTP}
              disabled={!isOtpComplete || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <Text style={styles.verifyButtonText}>Verifying...</Text>
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={!canResend}
              style={styles.resendButton}
            >
              <Text
                style={[
                  styles.resendButtonText,
                  !canResend && styles.resendButtonTextDisabled,
                ]}
              >
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f2ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  changeNumberButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeNumberText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  otpContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 300,
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  otpInputFilled: {
    borderColor: "#667eea",
    backgroundColor: "#f0f2ff",
  },
  verifyButton: {
    backgroundColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  resendContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  resendButtonTextDisabled: {
    color: "#999",
  },
});

export default VerifyOTPScreen;
