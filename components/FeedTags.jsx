import { Pressable, StyleSheet, Text } from 'react-native';
import { useState } from 'react';

export default function FeedTags({ tagLabel }) {
    const [tagButtonColor, setTagButtonColor] = useState("#FAEBD7")

    const onPress = () => {
        if (!(tagButtonColor === "#00FF7F")) {
            setTagButtonColor("#00FF7F");
        } else {
            setTagButtonColor("#FAEBD7");
        }
    };

    return (
        <Pressable
            style={[styles.preferenceTagsButton, { backgroundColor: tagButtonColor }]}
            onPress={onPress}>
            <Text style={styles.tags}>{tagLabel}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
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