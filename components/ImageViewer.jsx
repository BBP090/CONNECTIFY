import {StyleSheet} from "react-native";
import {Image} from "expo-image";

export default function ImageViewer({selectedImage, imgSource, altText}){
    const imageSource = selectedImage ? {uri : selectedImage} : imgSource;
    return <Image source={imageSource} alt={altText} style={styles.img} />;
}

const styles = StyleSheet.create({
    img: {
        width: 320,
        height: 420,
        borderRadius: 18,
    }
})