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
  Polyline,
} from "react-native-maps";
import { StyleSheet, View, Alert, Keyboard } from "react-native";
import * as Location from "expo-location";
import { ParkingLots } from "@/lib/types";
import { getRoute } from "react-native-maps-routes"; // Import the route utility

type LocationType = {
  latitude: number;
  longitude: number;
};

interface MapComponentProps {
  onLocationUpdate: (location: LocationType | null) => void;
  onRegionChange?: (region: Region) => void;
  initialRegion?: Region;
  showUserLocationMarker?: boolean;
  animateToUserLocation?: boolean;
  parkingLots?: ParkingLots[];
  destination?: LocationType | null; // New prop for destination
  showRoute?: boolean; // Whether to show the route
  routeColor?: string; // Color of the route line
  routeWidth?: number; // Width of the route line
}

export interface MapComponentRef {
  animateToRegion: (region: Region, duration?: number) => void;
  getCurrentRegion: () => Region | undefined;
  getUserLocation: () => LocationType | null;
  calculateRoute: (destination: LocationType) => Promise<void>; // New method to calculate route
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
      animateToUserLocation = false,
      parkingLots = [],
      destination = null,
      showRoute = true,
      routeColor = "#1a73e8",
      routeWidth = 4,
    },
    ref,
  ) => {
    const mapRef = useRef<MapView>(null);
    const [userLocation, setUserLocation] = useState<LocationType | null>(null);
    const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState<LocationType[]>(
      [],
    ); // Store route coordinates

    // Calculate route between two points
    const calculateRoute = useCallback(
      async (destination: LocationType) => {
        if (!userLocation) {
          Alert.alert("Error", "User location not available");
          return;
        }

        try {
          const route = await getRoute({
            origin: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            destination: {
              latitude: destination.latitude,
              longitude: destination.longitude,
            },
            // You can add more options here like travelMode: 'driving', 'walking', etc.
          });

          if (route && route.coordinates) {
            setRouteCoordinates(route.coordinates);

            // Optionally animate to show the entire route
            if (mapRef.current) {
              mapRef.current.fitToCoordinates(route.coordinates, {
                edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                animated: true,
              });
            }
          }
        } catch (error) {
          console.error("Route calculation error:", error);
          Alert.alert("Error", "Could not calculate route");
        }
      },
      [userLocation],
    );

    // Expose the calculateRoute method via ref
    useImperativeHandle(ref, () => ({
      animateToRegion: (targetRegion: Region, duration: number = 1000) => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(targetRegion, duration);
        }
      },
      getCurrentRegion: () => currentRegion,
      getUserLocation: () => userLocation,
      calculateRoute, // Expose the route calculation method
    }));

    // Calculate route when destination prop changes
    useEffect(() => {
      if (destination && showRoute) {
        calculateRoute(destination);
      } else {
        setRouteCoordinates([]); // Clear route if no destination
      }
    }, [destination, showRoute, calculateRoute]);

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

        if (animateToUserLocation && mapRef.current) {
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
    }, [onLocationUpdate, animateToUserLocation, isLocationLoading]);

    useEffect(() => {
      getUserLocation();
    }, [getUserLocation]);

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
          showsMyLocationButton={true}
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
              onPress={() => useParkingStore.getState().selectLot(lot)}
            />
          ))}

          {destination && (
            <Marker
              coordinate={destination}
              title="Destination"
              pinColor="green"
            />
          )}

          {showRoute && routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={routeColor}
              strokeWidth={routeWidth}
            />
          )}
        </MapView>
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
});

export default MapComponent;
