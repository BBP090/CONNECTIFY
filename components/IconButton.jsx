import { Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconButton({ icon, label, color, onPress }) {
    return (
        <Pressable style={styles.iconButton} onPress={onPress} >
            <MaterialIcons name={icon} size={20} color={color} />
            <Text style={[styles.iconButtonLabel, { color: color }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: 25
    },
    iconButtonLabel: {
        fontFamily: "Poppins_500Medium"
    },
});