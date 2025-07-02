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
import React, { useState, useRef } from "react";
import { Feather, Ionicons, FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
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
        _id: Date.now().toString(),
        messageType: "image",
        imageUrl: result.uri,
        timeStamp: new Date(),
        senderId: "self",
      };
      setMessages((prev) => [...prev, newImageMessage]);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      _id: Date.now().toString(),
      messageType: "text",
      message: message,
      timeStamp: new Date(),
      senderId: "self",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    scrollToBottom();
  };

  const handleSelectMessage = (msg) => {
    const isSelected = selectedMessages.includes(msg._id);
    if (isSelected) {
      setSelectedMessages((prev) => prev.filter((id) => id !== msg._id));
    } else {
      setSelectedMessages((prev) => [...prev, msg._id]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          const isSelected = selectedMessages.includes(item._id);
          const isSelf = item.senderId === "self";

          if (item.messageType === "text") {
            return (
              <Pressable
                key={index}
                onLongPress={() => handleSelectMessage(item)}
                style={[
                  {
                    alignSelf: isSelf ? "flex-end" : "flex-start",
                    backgroundColor: isSelf ? "#DCF8C6" : "white",
                    padding: 8,
                    margin: 10,
                    borderRadius: 7,
                    maxWidth: "60%",
                  },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {item.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.messageType === "image") {
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
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 200, height: 200, borderRadius: 7 }}
                />
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

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={handleSend}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prev) => prev + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});
