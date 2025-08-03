import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import UserProfileFeed from '../../components/UserProfileFeed';
import FeedTags from '../../components/FeedTags';
import { useAuth, useUser } from '@clerk/clerk-expo';
import useGetUserID from '../hooks/useGetUserID';

// const placeHolderImage = require("../../assets/image/background.png");
const smallImgSource = require("../../assets/images/background.png");
const profileFeedImgSource = require("../../assets/images/background.png");
const user_name = "Bishist Bikram Pant"

export default function Home() {
    const { isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const {userId, emailAddress} = useGetUserID();

    console.log(isSignedIn);

    const [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_500Medium,
        Poppins_400Regular
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <View style={styles.tagsContainer}>
                <FeedTags />
            </View>
            <ScrollView
                contentContainerStyle={Platform.OS === "web" && { alignItems: "center" }}
            >
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                />
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                />
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({

    tagsContainer: {
        backgroundColor: "white",
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: "space-between"
    },

    preferenceTagsButton: {
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 17,
        alignItems: "center"
    },

    tags: {
        padding: 5,
        paddingHorizontal: 7,
        fontSize: 15,
        fontFamily: "Poppins_400Regular"
    },

})
