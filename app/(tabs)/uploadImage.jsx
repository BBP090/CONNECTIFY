import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';

export default function UploadScreen() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'photo',
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const pickedImage = result.assets[0].uri;
    console.log("Picked image URI:", pickedImage);
    setImage(pickedImage);
  } else {
    console.log("Image picking cancelled or failed");
  }
};

  const uploadImage = async () => {
    const uriParts = image.split('.');
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append('photo', {
      uri: image,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    try {
      await axios.post('http://192.168.1.68:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Upload success');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Button title="Upload Image" onPress={uploadImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 200, height: 200, margin: 10 },
});
