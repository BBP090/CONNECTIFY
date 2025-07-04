import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import UserProfileFeed from '../../components/UserProfileFeed';
import FeedTags from '../../components/FeedTags';

// const placeHolderImage = require("../../assets/image/background.png");
const smallImgSource = require("../../assets/images/background.png");
const profileFeedImgSource = require("../../assets/images/background.png");
const user_name = "Bishist Bikram Pant"

export default function Home() {
    const [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_500Medium,
        Poppins_400Regular
    });
    const [status, setStatus] = useState(null);

    const accept = () => {
        setStatus(true);
    };

    const remove = () => {
        setStatus(false);
    }

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <View style={{ backgroundColor: "#FAEBD7" }}>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.tagsContainer}
                >
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                    <FeedTags tagLabel="Football" />
                </ScrollView>
            </View>
            <ScrollView>
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                    status={status}
                    accept={accept}
                    remove={remove}
                />
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                    status={status}
                    accept={accept}
                    remove={remove}
                />
                <UserProfileFeed
                    smallImgSource={smallImgSource}
                    profileFeedImgSource={profileFeedImgSource}
                    userName={user_name}
                    status={status}
                    accept={accept}
                    remove={remove}
                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({

    tagsContainer: {
        marginTop: 8,
        marginBottom: 8,
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