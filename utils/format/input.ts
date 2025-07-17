export function formatToInternational(phoneNumber: string): string {
  let cleaned = phoneNumber.replace(/[^\d]/g, ""); // Remove all non-digits

  if (cleaned.startsWith("255") && cleaned.length === 12) {
    return "+" + cleaned;
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    return "+255" + cleaned.slice(1);
  } else if (cleaned.length === 9 && !cleaned.startsWith("0")) {
    return "+255" + cleaned;
  } else {
    return "+" + cleaned;
  }
}
