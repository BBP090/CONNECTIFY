import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../../components/Button";
import CircleButton from "../../components/CircleButton";
import EmojiPicker from "../../components/EmojiPicker";
import IconButton from "../../components/IconButton";
import ImageViewer from "../../components/ImageViewer";

// No need for Link as we have tabs at the botton for navigation

const PlaceholderImage = require("../../assets/images/background.png");

export default function Home() {
    const [selectedImage, setSelectedImage] = useState(undefined); //to store the uri of the selected image so that, it can be displayed on the screen
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const onReset = () => {
        setShowAppOptions(false);
    };

    const onModalClose=()=>{
        setIsModalVisible(false);
    }

    const onAddSticker = () => {
        setIsModalVisible(true);
    };

    const onSaveImageAsync = async () => {
        //blah blah
    };

    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} altText="Background Image" />
            </View>
            {showAppOptions ?
                (
                    <View style={styles.optionsContainer}>
                        <View style={styles.optionsRow}>
                            <IconButton icon="refresh" label="Reset" onPress={onReset} />
                            <CircleButton onPress={onAddSticker} />
                            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.footerContainer}>
                        <Button label="Choose a photo" theme="primary" onPress={pickImageAsync} />
                        <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
                    </View>
                )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <></>
        </EmojiPicker>
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
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80, //push it up by 80 pixels
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
})