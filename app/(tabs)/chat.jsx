import { Text, StyleSheet, View } from "react-native";

export default function Chat() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                HELLOO!!!!!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    text:{
        color: "white"
    }
})