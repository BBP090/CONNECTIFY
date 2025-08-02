// Updated chat.jsx with backend integration
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
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import GetUserID from "../hooks/GetUserID";


const MessageScreen = () => {
 
  const router = useRouter();
  const { userId: userId, loading: idLoading } = GetUserID();
  const [messageRequests, setMessageRequests] = useState([]);
  const [ongoingMessages, setOngoingMessages] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://10.0.2.2:8000/requests/${userId}`)
      .then((res) => res.json())
      .then(setMessageRequests)
      .catch(console.error);
  }, []);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRequestPress = (item) => {
    setSelectedRequest(item);
    setShowModal(true);
  };

  const acceptRequest = async () => {
    try {
      const res = await fetch("http://10.0.2.2:8000/requests/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: selectedRequest.id }),
      });

      if (!res.ok) throw new Error("Accept failed");

      const newChat = {
        ...selectedRequest,
        chatId: selectedRequest.id, // placeholder until real chatId is returned from backend
      };

      setOngoingMessages((prev) =>
        [...prev, newChat].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      );

      setMessageRequests((prev) =>
        prev.filter((msg) => msg.id !== selectedRequest.id)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedRequest(null);
      setShowModal(false);
    }
  };

  const rejectRequest = async () => {
    try {
      const res = await fetch("http://10.0.2.2:8000/requests/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: selectedRequest.id }),
      });

      if (!res.ok) throw new Error("Reject failed");

      setMessageRequests((prev) =>
        prev.filter((msg) => msg.id !== selectedRequest.id)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedRequest(null);
      setShowModal(false);
    }
  };

  const enterChatRoom = (chatId) => {
    router.push({ pathname: "/ChatRoom", params: { chatId } });
  };

  const renderMessageItem = ({ item, isRequest }) => (
    <Pressable
      style={styles.messageRow}
      onPress={() =>
        isRequest ? handleRequestPress(item) : enterChatRoom(item.chatId)
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
        data={messageRequests.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMessageItem({ item, isRequest: true })}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No message requests</Text>
        }
      />

      <Text style={styles.sectionTitle}>Ongoing Chats</Text>
      <FlatList
        data={ongoingMessages.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )}
        keyExtractor={(item) => item.id.toString()}
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
  // keep your original styles here
});

//npx expo start -c