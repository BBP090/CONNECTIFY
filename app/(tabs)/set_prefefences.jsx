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

const preferencesList = [
  "Music",
  "Sports",
  "Games",
  "Coding",
  "Tech",
  "Art",
  "Photography",
  "Movies",
  "Fitness",
  "Travel",
  "Books",
  "Fashion",
  "Food",
  "Nature",
  "Anime",
  "Design",
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
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.nextButton}>
        <Ionicons name="arrow-forward-circle" size={40} color="#490028" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
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
    borderColor: "#ccc",
  },
  selectedItem: {
    backgroundColor: "#490028",
    borderColor: "#490028",
  },
  preferenceText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    alignSelf: "flex-end",
    marginTop: 40,
  },
});
