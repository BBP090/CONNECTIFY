import { Ionicons } from "@expo/vector-icons";
import { useTheme } from './contexts/ThemeContext';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { Colors } from "./constants/theme";

export default function SettingsScreen() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { isDarkMode, toggleTheme, colors } = useTheme();


  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log("Password changed");
    alert("Password updated successfully.");
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowChangePassword(false);
  };

  const handleLogoutConfirm = () => {
    console.log("User logged out");
    setLogoutVisible(false);
    // Add logout logic here
  };

  const bgColor = colors.background;
  const textColor = colors.text;
  const inputBg = colors.input;
  const borderColor = colors.border;


  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.heading, { color: textColor }]}>Settings</Text>

      {/* Change Password Option */}
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setShowChangePassword(!showChangePassword)}
      >
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} />
        <Text style={[styles.optionText, { color: textColor }]}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
      </TouchableOpacity>

      {showChangePassword && (
        <View style={styles.passwordForm}>
          <TextInput
            placeholder="Old Password"
            placeholderTextColor={darkMode ? "#aaa" : "#555"}
            style={[
              styles.input,
              { backgroundColor: inputBg, color: textColor, borderColor: borderColor },
            ]}
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            placeholder="New Password"
            placeholderTextColor={darkMode ? "#aaa" : "#555"}
            style={[
              styles.input,
              { backgroundColor: inputBg, color: textColor, borderColor: borderColor },
            ]}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder="Confirm New Password"
            placeholderTextColor={darkMode ? "#aaa" : "#555"}
            style={[
              styles.input,
              { backgroundColor: inputBg, color: textColor, borderColor: borderColor },
            ]}
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Theme Toggle Option */}
      <TouchableOpacity
        style={styles.optionRow}
        onPress={toggleTheme}
      >

        <Ionicons name="moon-outline" size={24} color={Colors.primary} />
        <Text style={[styles.optionText, { color: textColor }]}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>

        <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
      </TouchableOpacity>

      {/* Logout Option */}
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setLogoutVisible(true)}
      >
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={[styles.optionText, { color: "red" }]}>Logout</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
      </TouchableOpacity>

      {/* Custom Modal */}
      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: bgColor, borderColor: borderColor },
            ]}
          >
            <Text style={[styles.modalTitle, { color: textColor }]}>Confirm Logout</Text>
            <Text style={[styles.modalText, { color: textColor }]}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: Colors.grey }]}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.grey,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  passwordForm: {
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.black,
    fontWeight: "500",
  },
  logoutButton: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "red",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
