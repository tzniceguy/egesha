import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useVehicleStore } from "@/stores/vehicle";
import Header from "@/components/header";
import { Vehicle } from "@/lib/types";

const VehiclesScreen = () => {
  const { vehicles, fetchVehicles, addVehicle, isLoading } = useVehicleStore();
  const [newVehicle, setNewVehicle] = useState({
    license_plate: "",
    vehicle_type: "",
    make: "",
    model: "",
    color: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleAddVehicle = async () => {
    try {
      await addVehicle(newVehicle);
      setNewVehicle({
        license_plate: "",
        vehicle_type: "",
        make: "",
        model: "",
        color: "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to add vehicle.");
    }
  };

  const renderItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleItem}>
      <Text style={styles.vehicleText}>
        {item.make} {item.model} ({item.license_plate})
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="My Vehicles" />
      <FlatList
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <View style={styles.addVehicleContainer}>
        <TextInput
          style={styles.input}
          placeholder="License Plate"
          value={newVehicle.license_plate}
          onChangeText={(text) =>
            setNewVehicle({ ...newVehicle, license_plate: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Type (e.g., SUV)"
          value={newVehicle.vehicle_type}
          onChangeText={(text) =>
            setNewVehicle({ ...newVehicle, vehicle_type: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Make (e.g., Toyota)"
          value={newVehicle.make}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, make: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Model (e.g., RAV4)"
          value={newVehicle.model}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, model: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={newVehicle.color}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, color: text })}
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAddVehicle}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Adding..." : "Add Vehicle"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    flex: 1,
  },
  vehicleItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  vehicleText: {
    fontSize: 18,
  },
  addVehicleContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default VehiclesScreen;
