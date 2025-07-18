import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { ParkingLots } from "@/lib/types";
import { MapViewRoute } from "react-native-maps-routes";
import { GOOGLE_MAPS_API_KEY } from "@/lib/config";
import { LocateFixed } from "lucide-react-native";
import colors from "@/lib/styles/colors";

type LocationType = {
  latitude: number;
  longitude: number;
};

interface MapComponentProps {
  onLocationUpdate: (location: LocationType | null) => void;
  onRegionChange?: (region: Region) => void;
  initialRegion?: Region;
  showUserLocationMarker?: boolean;
  parkingLots?: ParkingLots[];
  destination?: LocationType | null;
  showRoute?: boolean;
  routeColor?: string;
  routeWidth?: number;
  onMarkerPress?: (lot: ParkingLots) => void;
}

export interface MapComponentRef {
  animateToRegion: (region: Region, duration?: number) => void;
  getCurrentRegion: () => Region | undefined;
  getUserLocation: () => LocationType | null;
}

const DEFAULT_REGION: Region = {
  latitude: -6.8235,
  longitude: 39.2695,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(
  (
    {
      onLocationUpdate,
      onRegionChange,
      initialRegion = DEFAULT_REGION,
      showUserLocationMarker = true,
      parkingLots = [],
      destination = null,
      showRoute = true,
      routeColor = "#1a73e8",
      routeWidth = 4,
      onMarkerPress,
    },
    ref,
  ) => {
    const mapRef = useRef<MapView>(null);
    const [userLocation, setUserLocation] = useState<LocationType | null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);
    const [isLocationLoading, setIsLocationLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      animateToRegion: (targetRegion: Region, duration: number = 1000) => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(targetRegion, duration);
        }
      },
      getCurrentRegion: () => currentRegion,
      getUserLocation: () => userLocation,
    }));

    const getUserLocation = useCallback(async () => {
      if (isLocationLoading) return;
      setIsLocationLoading(true);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to show your position.",
          );
          onLocationUpdate(null);
          setUserLocation(null);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 10000,
        });

        const fetchedLocation: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(fetchedLocation);
        onLocationUpdate(fetchedLocation);

        if (mapRef.current) {
          const userRegion: Region = {
            ...fetchedLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          mapRef.current.animateToRegion(userRegion, 1000);
        }
      } catch (error) {
        console.error("Location error:", error);
        Alert.alert("Location Error", "Could not fetch your current location.");
        onLocationUpdate(null);
        setUserLocation(null);
      } finally {
        setIsLocationLoading(false);
      }
    }, [onLocationUpdate, isLocationLoading]);

    const handleRegionChangeComplete = useCallback(
      (newRegion: Region) => {
        setCurrentRegion(newRegion);
        onRegionChange?.(newRegion);
      },
      [onRegionChange],
    );

    const handleMapPress = useCallback(() => {
      Keyboard.dismiss();
    }, []);

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={false} // Disable default button
          provider={PROVIDER_GOOGLE}
          onPress={handleMapPress}
        >
          {userLocation && showUserLocationMarker && (
            <Marker coordinate={userLocation} title="Your Location" />
          )}

          {parkingLots.map((lot) => (
            <Marker
              key={lot.id}
              coordinate={{
                latitude: parseFloat(lot.latitude),
                longitude: parseFloat(lot.longitude),
              }}
              title={lot.name}
              description={`${lot.available_spots_count} spots available`}
              onPress={() => onMarkerPress?.(lot)}
            />
          ))}

          {destination && (
            <Marker
              coordinate={destination}
              title="Destination"
              pinColor="green"
            />
          )}

          {userLocation && destination && showRoute && (
            <MapViewRoute
              origin={userLocation}
              destination={destination}
              apiKey={GOOGLE_MAPS_API_KEY}
              strokeWidth={routeWidth}
              strokeColor={routeColor}
            />
          )}
        </MapView>
        <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
          <LocateFixed size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 4,
  },
});

export default MapComponent;
