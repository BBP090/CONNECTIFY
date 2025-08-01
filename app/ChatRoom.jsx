// Updated ChatRoom.jsx with backend integration
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Feather, Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { chatId, userId = 1 } = route.params || {};

  useEffect(() => {
    if (chatId) {
      fetch(`http://10.0.2.2:8000/chat/${chatId}/messages`)
        .then(res => res.json())
        .then(setMessages)
        .catch(console.error);
    }
  }, [chatId]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const newMsg = {
      sender_id: userId,
      message,
      message_type: "text",
    };
    try {
      await fetch(`http://10.0.2.2:8000/chat/${chatId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      setMessages((prev) => [...prev, { ...newMsg, timeStamp: new Date(), senderId: "self" }]);
      setMessage("");
      scrollToBottom();
    } catch (e) {
      console.error(e);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImageMessage = {
        sender_id: userId,
        message: '',
        message_type: 'image',
        image_url: result.uri,
      };

      try {
        await fetch(`http://10.0.2.2:8000/chat/${chatId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newImageMessage),
        });

        setMessages((prev) => [...prev, {
          ...newImageMessage,
          imageUrl: result.uri,
          timeStamp: new Date(),
          senderId: "self",
        }]);
        scrollToBottom();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSelectMessage = (msg) => {
    const isSelected = selectedMessages.includes(msg._id);
    setSelectedMessages((prev) =>
      isSelected ? prev.filter((id) => id !== msg._id) : [...prev, msg._id]
    );
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((item, index) => {
          const isSelected = selectedMessages.includes(item._id);
          const isSelf = item.senderId === "self";

          if (item.message_type === "text") {
            return (
              <Pressable
                key={index}
                onLongPress={() => handleSelectMessage(item)}
                style={[{
                  alignSelf: isSelf ? "flex-end" : "flex-start",
                  backgroundColor: isSelf ? "#DCF8C6" : "white",
                  padding: 8,
                  margin: 10,
                  borderRadius: 7,
                  maxWidth: "60%",
                }, isSelected && { width: "100%", backgroundColor: "#F0FFFF" }]}
              >
                <Text style={{ fontSize: 13 }}>{item.message}</Text>
                <Text style={{ textAlign: "right", fontSize: 9, color: "gray", marginTop: 5 }}>
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.message_type === "image") {
            return (
              <Pressable
                key={index}
                style={{
                  alignSelf: isSelf ? "flex-end" : "flex-start",
                  backgroundColor: isSelf ? "#DCF8C6" : "white",
                  padding: 8,
                  margin: 10,
                  borderRadius: 7,
                  maxWidth: "60%",
                }}
              >
                <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 200, borderRadius: 7 }} />
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    position: "absolute",
                    right: 10,
                    bottom: 7,
                    color: "white",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#dddddd",
        marginBottom: showEmojiSelector ? 0 : 25,
      }}>
        <Entypo onPress={() => setShowEmojiSelector(!showEmojiSelector)} name="emoji-happy" size={24} color="gray" />

        <TextInput
          value={message}
          onChangeText={setMessage}
          style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#dddddd", borderRadius: 20, paddingHorizontal: 10 }}
          placeholder="Type your message..."
        />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginHorizontal: 8 }}>
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={handleSend}
          style={{ backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => setMessage((prev) => prev + emoji)}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
