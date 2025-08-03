import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const ProfilePage = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6, // compression
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setModalVisible(false);

      // 🔁 Optionally: upload here
      // await uploadImage(uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.rowLayout}>
        {/* 🔘 Change Picture */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.sideButton}>Change Picture</Text>
        </TouchableOpacity>

        {/* 🖼️ Profile Image */}
        <View style={styles.profileCircle}>
          <Image
            style={styles.profileImage}
            source={selectedImage ? { uri: selectedImage } : require("../../assets/images/pfp.png")}
          />
        </View>

        {/* 🔘 Edit Profile */}
        <TouchableOpacity onPress={() => router.push('/editProfile')}>
          <Text style={styles.sideButton}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Username and rest */}
      <Text style={styles.username}>Username</Text>

      <View style={styles.bioContainer}>
        <Text>Bio here</Text>
      </View>

      {/* Photos tab */}
      <View style={styles.photosTab}>
        <Text style={styles.photosTabText}>Photos</Text>
      </View>

      <View style={styles.photoGrid}>
        <View style={styles.photoBox}>
          <Image style={styles.photos} source={require("../../assets/images/emoji1.png")} />
        </View>
        <View style={styles.photoBox}>
          <Image style={styles.photos} source={require("../../assets/images/emoji2.png")} />
        </View>
        <View style={styles.photoBox}>
          <Image style={styles.photos} source={require("../../assets/images/emoji3.png")} />
        </View>
      </View>

      {/* 🔳 Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Select Profile Picture</Text>
            <Button title="Choose from Gallery" onPress={handlePickImage} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  profileCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    //borderWidth: 3,
    borderColor: '#000',
    resizeMode: 'cover', // or 'contain'
  },
  editButton: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  connectButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  connectText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  greenDot: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  bioContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  bioText: {
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
    marginVertical: 2,
  },
  photosTab: {
    // backgroundColor:"#28a745",
    width: '20%',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  photosTabText: {
    fontSize: 16,
    // fontWeight: '500',
    color: "#000",
    // textDecorationLine:'underline', 
    fontFamily: 'Instagram Sans Bold.ttf'
  },
  photoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  photoBox: {
    width: 130,
    height: 150,
  },
  photos: {
    width: 130,
    height: 150,
  },
  modalBackground: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContainer: {
  width: 300,
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  elevation: 10,
  alignItems: 'center',
},
rowLayout: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  marginBottom: 20,
  gap: 10,
},

sideButton: {
  fontSize: 14,
  color: '#333',
  textDecorationLine: 'underline',
  maxWidth: 80,
  textAlign: 'center',
},

});

export default ProfilePage;
