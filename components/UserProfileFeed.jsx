import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import RequestButton from './RequestButton';
import { BASE_URL } from "../config/config"; // adjust the path as needed

// const placeHolderImage = require("../../assets/images/background.png");

export default function UserProfileFeed({ sentBy, sentTo, smallImgSource, userName, profileFeedImgSource }) {

    const [status, setStatus] = useState(null);

    const sendRequest = async () => {
        try {
            console.log('Calling API:', `${BASE_URL}/requests/send`);
            // Send user email to backend MySQL
            const response = await fetch(`${BASE_URL}/requests/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    from_user_id: sentBy,
                    to_user_id: sentTo,
                })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('request sent:', data);

            if (data.success)
                setStatus(true);

            if (!response.ok) {
                console.log("API call failed", response.ok);
            }
        } catch (error) {
            console.error("Error sending request:", error);
            setStatus(false);
        }
    };


    if (status === null) {
        console.log(status);
        return (
            <>
                <LinearGradient
                    colors={["#008000", "#b2f7b2"]}
                    style={styles.border}
                >
                    <View style={[styles.userFeed1, Platform.OS === 'web' && { width: 450 }]}>
                        <View style={styles.profileTitleContainer}>

                            <Image source={smallImgSource} style={styles.profileSmallImage}></Image>
                            <TouchableOpacity onPress={()=>router.push('/viewProfile')}>
                                <View style={styles.profileUserNameContainer}>
                                    <Text style={[styles.profileUserName]}>{userName}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Image source={profileFeedImgSource} style={styles.profileFeedImage}></Image>
                        </View>
                        <View style={styles.buttonContainer}>
                            <RequestButton onPress={() => {
                                sendRequest();
                            }}
                                iconName="check-circle-outline" label="Send Request" iconColor="green" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14, marginLeft: 2 }} />
                        </View>
                    </View >
                </LinearGradient >
                <View style={{ padding: 5 }}>
                </View>
            </>
        );
    } else if (status === true) {
        console.log(status);
        return (
            <>
                <LinearGradient
                    colors={["#008000", "#b2f7b2"]}
                    style={styles.border}
                >
                    <View style={[styles.userFeed1, Platform.OS === 'web' && { width: 450 }]}>
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
                            <RequestButton iconName="check-circle" label="Request Sent!" iconColor="green" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14 }} />
                        </View>
                    </View>
                </LinearGradient>
                <View style={{ padding: 5 }}>
                </View>
            </>
        );
    } else {
        console.log(status);
        return (
            <>
                <LinearGradient
                    colors={["#008000", "#b2f7b2"]}
                    style={styles.border}
                >
                    <View style={[styles.userFeed1, Platform.OS === 'web' && { width: 450 }]}>
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
                            <RequestButton iconName="error-outline" label="Error Sending Request!" iconColor="red" labelStyle={{ fontFamily: "Poppins_500Medium", fontSize: 14 }} />
                        </View>
                    </View>
                </LinearGradient>
                <View style={{ padding: 5 }}>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({

    border: {
        padding: 5,
        borderRadius: 5,
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