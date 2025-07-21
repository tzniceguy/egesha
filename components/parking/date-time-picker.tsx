import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// Reusable DateTime Picker Component
const Picker = ({
  value,
  onChange,
  mode = "datetime",
  display = "default",
  minimumDate,
  maximumDate,
  is24Hour = true,
  label,
  placeholder = "Select date & time",
  style,
}) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const showPicker = () => {
    setShow(true);
  };

  const hidePicker = () => {
    setShow(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      hidePicker();
      return;
    }

    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);

    if (event.type === "set") {
      onChange(currentDate);
      hidePicker();
    }
  };

  const formatDateTime = (date) => {
    if (!date) return placeholder;

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    };

    return date.toLocaleString("en-GB", options).replace(",", " -");
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={showPicker}
        activeOpacity={0.7}
      >
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {formatDateTime(value)}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={tempDate}
          mode={mode}
          display={display}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          is24Hour={is24Hour}
        />
      )}
    </View>
  );
};
