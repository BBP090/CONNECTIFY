import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import UserProfileFeed from '../../components/UserProfileFeed';
import FeedTags from '../../components/FeedTags';
import { useAuth } from '@clerk/clerk-expo';
import useGetUserID from '../hooks/useGetUserID';
import { BASE_URL } from "../../config/config"; // adjust the path as needed

// const placeHolderImage = require("../../assets/image/background.png");
const smallImgSource = require("../../assets/images/background.png");
const profileFeedImgSource = require("../../assets/images/background.png");
const user_name = "Bishist Bikram Pant"

export default function Home() {
    // const { user } = useUser();
    const [users, setUsers] = useState([]);
    const tags = ["Music", "Sports", "Games", "Coding", "Tech", "Art", "Photography", "Movies", "Fitness", "Travel", "Books", "Fashion", "Food", "Nature", "Anime", "Design"];
    const [selectedTags, setSelectedTags] = useState([]);
    const { userId } = useGetUserID();
    const { isSignedIn } = useAuth();


    // console log to check sign in state and users retrieved
    console.log(isSignedIn);
    console.log(userId);
    console.log('users:', users);
    console.log('selected tags:', selectedTags);

    // to retrieve user profile
    useEffect(() => {
        if (!userId) return;
        const retrieveUser = async () => {
            try {
                // const token = await getToken();
                // console.log('Token present:', !!token);

                // const params = new URLSearchParams();
                // params.append('userId', userId);
                // selectedTags.forEach(tag => params.append('tags', tag));

                console.log('Calling API:', `${BASE_URL}/api/get-userProfile?userId=${userId}`);
                // ✅ Send user email to backend MySQL
                const response = await fetch(`${BASE_URL}/api/get-userProfile?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);
                setUsers(data.result);

                if (!response.ok) {
                    console.log("API call failed", response.ok);
                }
            } catch (error) {
                console.error("Error retrieving users:", error);
            }
        }
        retrieveUser();

        // to filter users by tags
        const retrieveUserByTags = async () => {
            if (!userId) return;

            console.log('tags', selectedTags);
            try {
                const params = new URLSearchParams();
                params.append('userId', userId);
                selectedTags.forEach(tag => params.append('tags', tag));

                console.log('Calling API to retreive users by tags', `${BASE_URL}/api/get-user-profile-by-tags?${params.toString()}`);

                const response1 = await fetch(`${BASE_URL}/api/get-user-profile-by-tags?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data1 = await response1.json();
                console.log('users by tags:', data1.result1);
                setUsers(users.concat(data1.result1));
            } catch (err) {
                console.error('Error retrieving users by tags:', err);
            }
        }

        if (selectedTags)
            retrieveUserByTags();

    }, [userId, selectedTags]);


    const issSelected = (item) => (selectedTags.includes(item));

    const checker = (isSelected, item) => {
        if (isSelected) {
            setSelectedTags(selectedTags.filter((currentValue) => currentValue != item));
        } else {
            setSelectedTags([...selectedTags, item]);
        }
    };

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
                <FeedTags tags={tags} checker={checker} issSelected={issSelected} />
            </View>
            <ScrollView
                contentContainerStyle={Platform.OS === "web" && { alignItems: "center" }}
            >
                {
                    users && users.map((user) => {
                        return (
                            <UserProfileFeed
                                smallImgSource={smallImgSource}
                                profileFeedImgSource={profileFeedImgSource}
                                userName={user.userId}
                            />
                        )
                    })
                }
                {/* <UserProfileFeed
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
                /> */}
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
