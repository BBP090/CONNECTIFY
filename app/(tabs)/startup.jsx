import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function StartupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
        source={require("../../assets/images/connectify_logo.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>Connect with people of similar interest</Text>

      {/* Getting Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/signup')}

      >
        <Text style={styles.buttonText}>Getting Started</Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => router.push('/login')}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  image: {
    width: "80%",
    height: 250,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#008000",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#444",
  },
  loginLink: {
    color: "#008000",
    fontWeight: "bold",
  },
});
