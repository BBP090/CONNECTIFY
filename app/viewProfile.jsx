import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '../config/config';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons'; // Make sure expo/vector-icons is installed



export default function ViewProfile() {
  const { userId } = useLocalSearchParams(); // received from router.push()
  console.log('user viewing', userId);
  const [userData, setUserData] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user/${userId}`);
        const data = await res.json();
        console.log('User data:', data);
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    const fetchUserPhotos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user-photos/${userId}`);
        const data = await res.json();
        setPhotos(data.map(item => `${BASE_URL}/${item.image_path}`));
      } catch (error) {
        console.error("Failed to fetch photos", error);
      }
    };

    fetchUserData();
    fetchUserPhotos();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={
            userData.profile_image
              ? { uri: `${BASE_URL}${userData.profile_image}` }
              : require('../assets/images/pfp.png')
          }
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userData.Name}</Text>
        <Text style={styles.bio}>{userData.Bio}</Text>
      </View>

      <Text style={styles.photosTitle}>Photos</Text>
      <View style={styles.photoGrid}>
        {photos.map((uri, idx) => (
          <View key={idx} style={styles.photoBox}>
            <Image source={{ uri }} style={styles.photo} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#000',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 5,
  },
  photosTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  photoBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
})