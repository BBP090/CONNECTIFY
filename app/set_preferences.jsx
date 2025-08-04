import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { BASE_URL } from "../config/config.js"; // Adjust path if necessary
import { Colors } from "./constants/theme.js"; // Adjust the path if needed
import useGetUserID from "./hooks/useGetUserID.js";

const preferencesList = [
  "Music", "Sports", "Games", "Coding", "Tech",
  "Art", "Photography", "Movies", "Fitness", "Travel",
  "Books", "Fashion", "Food", "Nature", "Anime", "Design",
];

export default function PreferencesScreen() {
  const { userId, email } = useGetUserID();  // Get the userId from Clerk's session
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [otherPreference, setOtherPreference] = useState("");
  console.log(selectedPreferences);

  // Handle preferences change
  const togglePreference = (item, isSelected) => {
    if (isSelected) {
      setSelectedPreferences(selectedPreferences.filter((currentValue) => currentValue != item));
    } else {
      setSelectedPreferences([...selectedPreferences, item]);
    }
  };

  const handleSubmit = async () => {
    const allPreferences = [...selectedPreferences];
    if (otherPreference.trim()) {
      allPreferences.push(`Other: ${otherPreference.trim()}`);
    }

    // Send preferences to your backend
    try {
      const response = await fetch(`${BASE_URL}/api/user/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId, // Using Clerk's user ID
          preferences: allPreferences,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Preferences saved:", data);
        router.replace('/');// Redirect to the homepage after saving preferences
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>What are your preferences?</Text>

      <View style={styles.preferenceGrid}>
        {/* Display list of preferences */}
        {preferencesList.map((item) => {
          const isSelected = selectedPreferences.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.preferenceItem,
                (isSelected) && styles.selectedItem,
              ]}
              onPress={() => togglePreference(item, isSelected)}
            >
              <Text
                style={[
                  styles.preferenceText,
                  (isSelected) && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <TextInput
        autoFocus={true}
        style={styles.input}
        placeholder="Other interests..."
        value={otherPreference}
        onChangeText={setOtherPreference}
        placeholderTextColor={Colors.lightGrey}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
        <Ionicons name="arrow-forward-circle" size={40} color={Colors.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
}
// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.black,
  },
  preferenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  preferenceItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  selectedItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  preferenceText: {
    fontSize: 14,
    color: Colors.black,
  },
  selectedText: {
    color: Colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
    fontSize: 16,
    color: Colors.black,
  },
  nextButton: {
    alignSelf: "flex-end",
    marginTop: 40,
  },
});
