import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, SafeAreaView, Alert, Text } from "react-native";
import * as Location from "expo-location";

type LocationType = {
  latitude: number;
  longitude: number;
};
export default function MapComponent() {
  const [region, setRegion] = useState({
    latitude: -6.8235, // Dar es Salaam latitude
    longitude: 39.2695, // Dar es Salaam longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    //function to ger user location
    const getUserLocation = async () => {
      //request persmission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert("Permission Denied", "Location permison is required");
        return;
      }

      try {
        //get user location
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        //update user location state
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        //update region state
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        setErrorMsg("could not fetch location");
        Alert.alert("Error", "Could not fetch location");
      }
    };
    getUserLocation();
  }, []);

  const onRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={onRegionChange}
        zoomEnabled={true}
        rotateEnabled={true}
      >
        {/* Add marker inside the MapView */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            description="This is your current location"
          ></Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
