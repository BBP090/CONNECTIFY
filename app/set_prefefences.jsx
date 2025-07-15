import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "./constants/theme.js"; // adjust the path if needed

const preferencesList = [
  "Music", "Sports", "Games", "Coding", "Tech",
  "Art", "Photography", "Movies", "Fitness", "Travel",
  "Books", "Fashion", "Food", "Nature", "Anime", "Design",
];

export default function PreferencesScreen() {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [otherPreference, setOtherPreference] = useState("");

  const togglePreference = (item) => {
    if (selectedPreferences.includes(item)) {
      setSelectedPreferences(selectedPreferences.filter((i) => i !== item));
    } else {
      setSelectedPreferences([...selectedPreferences, item]);
    }
  };

  const handleSubmit = async () => {
    const allPreferences = [...selectedPreferences];
    if (otherPreference.trim()) {
      allPreferences.push(`Other: ${otherPreference.trim()}`);
    }

    try {
      const response = await fetch("http://your-api-url/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "USER_ID_HERE", // replace with real user ID or token
          preferences: allPreferences,
        }),
      });

      const data = await response.json();
      console.log("Preferences saved:", data);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>What are your preferences?</Text>

      <View style={styles.preferenceGrid}>
        {preferencesList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.preferenceItem,
              selectedPreferences.includes(item) && styles.selectedItem,
            ]}
            onPress={() => togglePreference(item)}
          >
            <Text
              style={[
                styles.preferenceText,
                selectedPreferences.includes(item) && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
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
