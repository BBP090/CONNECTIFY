import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const MessageScreen = () => {
  const navigation = useNavigation();
  const router= useRouter();

  const [messageRequests, setMessageRequests] = useState([
    {
      id: "1",
      name: "Aayush Sharma",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      message: "Hey! I’d like to chat with you.",
      timestamp: new Date("2025-07-02T10:30:00"),
    },
    {
      id: "2",
      name: "Pooja Karki",
      image: "https://randomuser.me/api/portraits/women/60.jpg",
      message: "Hello 👋",
      timestamp: new Date("2025-07-02T09:15:00"),
    },
  ]);

  const [ongoingMessages, setOngoingMessages] = useState([
    {
      id: "3",
      name: "Sujan Anand",
      image: "https://randomuser.me/api/portraits/men/31.jpg",
      message: "Let's meet at 5pm today.",
      timestamp: new Date("2025-07-01T18:45:00"),
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleRequestPress = (item) => {
    setSelectedRequest(item);
    setShowModal(true);
  };

  const acceptRequest = () => {
    setOngoingMessages((prev) =>
      [...prev, selectedRequest].sort((a, b) => b.timestamp - a.timestamp)
    );
    setMessageRequests((prev) =>
      prev.filter((msg) => msg.id !== selectedRequest.id)
    );
    setSelectedRequest(null);
    setShowModal(false);
  };

  const rejectRequest = () => {
    setMessageRequests((prev) =>
      prev.filter((msg) => msg.id !== selectedRequest.id)
    );
    setSelectedRequest(null);
    setShowModal(false);
  };

  const enterChatRoom = () => {
    router.push("/ChatRoom");
  };

 

  const renderMessageItem = ({ item, isRequest }) => (
    <Pressable
      style={styles.messageRow}
      onPress={() =>
        isRequest ? handleRequestPress(item) : enterChatRoom()
      }
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.messageTextContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text numberOfLines={1} style={styles.preview}>
          {item.message}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Message Requests</Text>
      <FlatList
        data={messageRequests.sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderMessageItem({ item, isRequest: true })}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No message requests</Text>
        }
      />

      <Text style={styles.sectionTitle}>Ongoing Chats</Text>
      <FlatList
        data={ongoingMessages.sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderMessageItem({ item, isRequest: false })}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ongoing chats</Text>
        }
      />

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Accept message from {selectedRequest?.name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.acceptBtn} onPress={acceptRequest}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={rejectRequest}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  preview: {
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
  },
  acceptBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "600",
  },
});
