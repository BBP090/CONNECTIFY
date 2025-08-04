import { View } from "react-native";
import { Image } from "expo-image";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

// Animated lets us animate text, scrollview, view and image too in this case
// Animated component looks at the style prop and determines which values to animate and applies the updates to create an animation

export default function EmojiSticker({ imageSize, stickerSource }) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scaleImage = useSharedValue(imageSize);
    // we could use state variables but it will trigger re-render everytime the variable is updated so, for optimal rendering we useSharedValue

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            if (scaleImage.value !== imageSize * 2) {
                scaleImage.value = scaleImage.value * 2;
            } else {
                scaleImage.value = Math.round(scaleImage.value / 2);
            }
        });

    const drag = Gesture.Pan()
        .onChange((event) => {
            translateX.value += event.changeX;
            translateY.value += event.changeY;
        });

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        };
    });

    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle, { top: -350 }]}>
                <GestureDetector gesture={doubleTap}>
                    <Animated.Image
                        source={stickerSource}
                        resizeMode="contain"
                        style={[imageStyle, { width: imageSize, height: imageSize }]}
                    />
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    )
}