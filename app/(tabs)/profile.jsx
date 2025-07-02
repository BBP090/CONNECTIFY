import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfilePage = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCircle}>
        <Image  style={styles.profileImage} source={require("../../assets/images/pfp.png")}/>
      </View>

      <Text style={styles.editProfile}>Edit Profile</Text>
      <Text style={styles.username}>Username</Text>

      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectText}>Connect</Text>
        {/* <View style={styles.greenDot} /> */}
      </TouchableOpacity>

      <View style={styles.bioContainer}>
        <Text>
            Bio here
        </Text>
      </View>

      <View style={styles.photosTab}>
        <Text style={styles.photosTabText}>Photos</Text>
      </View>

      <View style={styles.photoGrid}>
        <View style={styles.photoBox} />
        <View style={styles.photoBox} />
        <View style={styles.photoBox} />
      </View>
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
  editProfile: {
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
    borderTopWidth: 2,
    borderBottomWidth: 2,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  photosTabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  photoBox: {
    width: 90,
    height: 120,
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default ProfilePage;
