import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  address: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: "#3b82f6",
  },
  inactiveBadge: {
    backgroundColor: "#e5e7eb",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeBadgeText: {
    color: "#ffffff",
  },
  inactiveBadgeText: {
    color: "#6b7280",
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
  },
  mapCoords: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#374151",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  spotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  spotCard: {
    width: (width - 80) / 3,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  spotCardDisabled: {
    opacity: 0.5,
  },
  spotCardSelected: {
    borderColor: "#3b82f6",
    borderWidth: 2,
    backgroundColor: "#eff6ff",
  },
  spotIcon: {
    marginBottom: 8,
  },
  spotId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  spotType: {
    fontSize: 12,
    color: "#6b7280",
  },
  spotPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginTop: 4,
  },
  bookingSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
  },
  bookingInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  bookingSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  bookButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
  },
  picker: {
    height: 50,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  durationButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    marginHorizontal: 4,
  },
  durationButtonSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  durationButtonTextSelected: {
    color: "#ffffff",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
