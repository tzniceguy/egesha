import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet, View, Alert } from "react-native";
import * as Location from "expo-location";

// Define types (can be shared or defined in Page)
type LocationType = {
  latitude: number;
  longitude: number;
};

// Props for MapComponent
interface MapComponentProps {
  onLocationUpdate: (location: LocationType | null) => void;
  initialRegion?: Region; // Make initialRegion optional or controlled from Page
}

// Define the type for the methods exposed via the ref
export interface MapComponentRef {
  animateToRegion: (region: Region, duration?: number) => void;
}

// Default region if needed
const DEFAULT_REGION = {
  latitude: -6.8235, // Dar es Salaam latitude
  longitude: 39.2695, // Dar es Salaam longitude
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(
  ({ onLocationUpdate, initialRegion = DEFAULT_REGION }, ref) => {
    const mapRef = useRef<MapView>(null);
    // Keep userLocation internal for the marker placement
    const [userLocation, setUserLocation] = useState<LocationType | null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion); // Manage current region for user interaction

    // Expose the animateToRegion method via the ref
    useImperativeHandle(ref, () => ({
      animateToRegion: (targetRegion: Region, duration: number = 1000) => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(targetRegion, duration);
          // Optionally update internal region state after animation if needed
          // setCurrentRegion(targetRegion); // Be careful with this if onRegionChangeComplete is also used
        }
      },
    }));

    useEffect(() => {
      const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to show your position.",
          );
          onLocationUpdate(null); // Inform parent
          setUserLocation(null); // Update internal state
          return;
        }

        try {
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const fetchedLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(fetchedLocation); // Update internal state for marker
          onLocationUpdate(fetchedLocation); // Inform parent
          // Optionally animate map to initial user location
          // mapRef.current?.animateToRegion({
          //   ...fetchedLocation,
          //   latitudeDelta: 0.01,
          //   longitudeDelta: 0.01,
          // }, 1000);
        } catch (error) {
          Alert.alert("Error", "Could not fetch location.");
          onLocationUpdate(null); // Inform parent
          setUserLocation(null); // Update internal state
        }
      };
      getUserLocation();
      // Only run once on mount, dependencies might include onLocationUpdate if its identity changes
    }, [onLocationUpdate]);

    // Update internal region state when user manually moves the map
    const handleRegionChangeComplete = (newRegion: Region) => {
      setCurrentRegion(newRegion);
      // console.log("Map Region Changed (User):", newRegion); // For debugging
    };

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          // Use region prop to control map view programmatically if needed,
          // or rely on initialRegion and animateToRegion
          initialRegion={initialRegion} // Set initial view
          region={currentRegion} // Reflects user interaction if handleRegionChangeComplete updates it
          onRegionChangeComplete={handleRegionChangeComplete} // Use Complete to avoid excessive updates
          showsUserLocation={true}
          showsMyLocationButton={true} // Consider positioning relative to SearchModal
          zoomEnabled={true}
          rotateEnabled={true}
        >
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              // Optional: Use a custom marker image
            />
          )}
        </MapView>
      </View>
    );
  },
);

// --- Styles remain the same ---
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

export default MapComponent;
