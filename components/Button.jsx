import { Text, View, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

export default function Button({ label, theme, onPress }) {
    if (theme === "primary") {
        return (
            <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}>
                <Pressable style={[styles.button, { backgroundColor: "black" }]} onPress={onPress}>
                    <FontAwesome
                        name="arrow-circle-o-right"
                        size={18}
                        color="#25292e"
                        style={styles.buttonIcon}
                    />
                    <Text style={[styles.buttonLabel, { color: "white" }]}>{label}</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
        // backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    buttonContainer: {
        width: 320,
        height: 38,
        padding: 3,
        // borderWidth: 4,
        // borderColor: "black",
        // borderRadius: 18,
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonIcon: {
        // textAlignVertical: 'center', // Android only
        color: "white",
        paddingRight: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "bold"
    }
})