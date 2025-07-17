import { Region } from "react-native-maps";

export const ZOOMED_IN_DELTA = { latitudeDelta: 0.005, longitudeDelta: 0.005 };
export const ZOOMED_OUT_DELTA = { latitudeDelta: 0.02, longitudeDelta: 0.02 };

export const INITIAL_MAP_REGION: Region = {
  latitude: -6.8235, // Dar es Salaam
  longitude: 39.2695,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
