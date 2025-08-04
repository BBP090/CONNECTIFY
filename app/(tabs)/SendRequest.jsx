import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import useGetUserID from "../hooks/useGetUserID";
import { BASE_URL } from "../../config/config"; // adjust the path as needed


const SendRequest = () => {
  const [marker, setMarker] = useState(null);
    const { userId: userId, loading: idLoading } = useGetUserID();


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


     
      Alert.alert('Location saved!');
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to save location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} onPress={handleMapPress}>
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <Button title="Save Location" onPress={handleSaveLocation} />
    </View>
  );
}


export default SendRequest;

const styles = StyleSheet.create({
   container: { flex: 1 },
  map: { flex: 1 }
});