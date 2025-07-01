import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button"
import * as ImagePicker from "expo-image-picker";

// No need for Link as we have tabs at the botton for navigation

const PlaceholderImage = require("../../assets/images/background.png");

export default function Home() {
    const [selectedImage, setSelectedImage] = useState(undefined); //to store the uri of the selected image so that, it can be displayed on the screen
    const [showAppOptions, setShowAppOptions] = useState(false);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
            console.log(result);
        } else {
            alert("You did not select any image.");
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} altText="Background Image" />
            </View>
            {showAppOptions ?
                (
                    <View />
                ) : (
                    <View style={styles.footerContainer}>
                        <Button label="Choose a photo" theme="primary" onPress={pickImageAsync} />
                        <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "grey",
    },
    text: {
        textAlign: "center",
        color: "white",
    },
    imgContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "grey",
    },
    footerContainer: {
        flex: 1 / 3,
    }
})