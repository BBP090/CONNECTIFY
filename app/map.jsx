import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useGetUserID from "./hooks/useGetUserID";
import { BASE_URL } from "../config/config"; // adjust the path as needed

import { useRouter } from 'expo-router';


const map = () => {
  const [marker, setMarker] = useState(null);
    const { userId: userId, loading: idLoading } = useGetUserID();
      const router = useRouter();


  const handleMapPress = (e) => {
    setMarker(e.nativeEvent.coordinate);
  };

  const handleSaveLocation = async () => {
    if (!marker) return Alert.alert('Pick a location on the map');
    try {


      await fetch(`${BASE_URL}/set_location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({  userId: userId,
        latitude: marker.latitude,
        longitude: marker.longitude }),
          });


     
     Alert.alert(
  'Location saved!',
  '',
  [
    {
      text: 'OK',
      onPress: () => {
        router.replace('/');
      }
    }
  ]
);

    } catch (err) {
      console.error(err);
      Alert.alert('Failed to save location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
  style={styles.map}
  onPress={handleMapPress}
  initialRegion={{
    latitude: 27.7172,
    longitude: 85.3240,
    latitudeDelta: 7.5,
    longitudeDelta: 5.0,
  }}
>
  {marker && <Marker coordinate={marker} />}
</MapView>
      <Button title="Save Location" onPress={handleSaveLocation} />
    </View>
  );
}


export default map;

const styles = StyleSheet.create({
   container: { flex: 1 },
  map: { flex: 1 }
});