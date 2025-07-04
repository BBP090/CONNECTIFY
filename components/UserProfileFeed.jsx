import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import RequestButton from './RequestButton';
import IconButton from './IconButton';

// const placeHolderImage = require("../../assets/images/background.png");

export default function UserProfileFeed({ smallImgSource, userName, profileFeedImgSource, status, accept, remove }) {

    if (status === null) {
        return (
            <View style={{marginBottom: 10}}>
                <LinearGradient
                    colors={["#FAEBD7", "#fff"]}
                    style={styles.border}
                >
                    <View style={styles.userFeed1}>
                        <View style={styles.profileTitleContainer}>
                            <Image source={smallImgSource} style={styles.profileSmallImage}></Image>
                            <View style={styles.profileUserNameContainer}>
                                <Text style={[styles.profileUserName]}>{userName}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Image source={profileFeedImgSource} style={styles.profileFeedImage}></Image>
                        </View>
                        <View style={styles.buttonContainer}>
                            <RequestButton onPress={remove} iconName="remove-circle-outline" label="Remove" iconColor="red" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14, marginLeft: 2 }} />
                            <View style={{ width: 2, height: '100%', backgroundColor: '#000', marginHorizontal: 1 }} />
                            <RequestButton onPress={accept} iconName="check-circle-outline" label="Accept" iconColor="green" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14, marginLeft: 2 }} />
                        </View>
                    </View>
                </LinearGradient>
            </View>
        );
    } else if (status === true) {
        return (
            <View style={{marginBottom: 10}}>
                <LinearGradient
                    colors={["#FAEBD7", "#ffff"]}
                    style={styles.border}
                >
                    <View style={styles.userFeed1}>
                        <View style={styles.profileTitleContainer}>
                            <Image source={smallImgSource} style={styles.profileSmallImage}></Image>
                            <View style={styles.profileUserNameContainer}>
                                <Text style={[styles.profileUserName]}>{userName}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Image source={profileFeedImgSource} style={styles.profileFeedImage}></Image>
                        </View>
                        <View style={styles.buttonContainer}>
                            <RequestButton iconName="check-circle" label="Accepted" iconColor="green" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14 }} />
                        </View>
                    </View>
                </LinearGradient>
            </View>
        );
    } else {
        return null;
    }
}

const styles = StyleSheet.create({

    border: {
        padding: 3,
        borderTopEndRadius: 10
    },

    userFeed1: {
        width: '100%',
        height: 650,
    },

    profileTitleContainer: {
        flexDirection: "row",
        padding: 5,
        paddingLeft: 2
    },

    profileUserNameContainer: {
        justifyContent: "center",
        marginHorizontal: 5
    },

    profileUserName: {
        fontSize: 15,
        fontFamily: "Poppins_600SemiBold"
    },

    profileSmallImage: {
        borderRadius: 20,
        width: 40,
        height: 40
    },

    profileFeedImage: {
        borderRadius: 5,
        width: '100%',
        height: '100%'
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 7,
        paddingHorizontal: 30
    },
});