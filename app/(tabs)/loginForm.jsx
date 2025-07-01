import { View, TextInput, StyleSheet, Text } from "react-native";
import Button from "@/components/Button";

export default function loginForm() {
    return (
        <>
            <Text style={styles.Heading}>Welcome!!</Text>
            <View style={styles.container}>
                <View>
                    <TextInput style={styles.inputForm} placeholder="Username" ></TextInput>
                    <TextInput style={styles.inputForm} placeholder="Password" ></TextInput>
                </View>
                <View style={styles.ButtonContainer}>
                    <Button label="Log in" theme="login" />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    Heading: {
        backgroundColor: "white",
        marginBottom: 5,
        textAlign: "center",
        fontSize: 50,
        fontFamily: "",
    },
    inputForm: {
        marginBottom: 10,
        padding: 10,
        width: 320,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "black",
    },
    ButtonContainer: {
        flex: 1 / 3,
        marginTop: 20,
        alignItems: "center",
    }
})