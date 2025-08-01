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
import React, { useEffect ,useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import GetUserID from "../hooks/GetUserID";


const MessageScreen = () => {
  const navigation = useNavigation();
  const { userId: userId, loading: idLoading } = GetUserID();
  const [messageRequests, setMessageRequests] = useState([]);
  const [ongoingMessages, setOngoingMessages]=useState([]);
  const [loading, setLoading] = useState(false);
  const router= useRouter();

  // Fetch all message requests and filter out self
    useEffect(() => {
      if (!userId) return;
  
      setLoading(true);
      fetch(`http://10.0.2.2:8000/requests/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          
          setMessageRequests(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, [userId]);

    // Fetch all ongoing messages.
    useEffect(()=>{
      if (!userId) return;
      
      setLoading(true);
      fetch(`http://10.0.2.2:8000/ongoing_messages/${userId}`)
        .then((res)=>res.json())
        .then((data) => {
          setOngoingMessages(data);
        })
        .catch((err)=>console.error(err))
        .finally(()=> setLoading(false));
    }, [userId])

    /*
  const [messageRequests, setMessageRequests] = useState([
    {
      id: "1",
      name: "Aayush Sharma",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrmzAf4-rCEcXr2HB664ssYWrQqcLX-S9Udw&s",
      message: "Hey! I’d like to chat with you.",
      timestamp: new Date("2025-07-02T10:30:00"),
    },
    {
      id: "2",
      name: "Pooja Karki",
      image: "https://c8.alamy.com/comp/2B7HT50/portraits-of-people-pokhara-nepal-2B7HT50.jpg",
      message: "Hello 👋",
      timestamp: new Date("2025-07-02T09:15:00"),
    },
  ]);

  const [ongoingMessages, setOngoingMessages] = useState([
    {
      id: "3",
      name: "Sujan Anand",
      image: "https://media.istockphoto.com/id/583710772/photo/man-looking-at-camera.jpg?s=612x612&w=0&k=20&c=S0sW-8RJnc61XMIvM6Y9_M1E5J5HQk4v0hK5V5DQCgM=",
      message: "Let's meet at 5pm today.",
      timestamp: new Date("2025-07-01T18:45:00"),
    },
  ]);
*/
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

 const formatTime = (date) => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? "Invalid" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};


  const handleRequestPress = (item) => {
    console.log("Item on press:", item);

    setSelectedRequest(item);
    setShowModal(true);
  };

  const acceptRequest = async() => {
    console.log("Selected request ID to accept:", selectedRequest?.id);

    
    setOngoingMessages((prev) =>
      [...prev, selectedRequest].sort((a, b) => b.timestamp - a.timestamp)
    );
    setMessageRequests((prev) =>
      prev.filter((msg) => msg.id !== selectedRequest.id)
    );
    setSelectedRequest(null);
    setShowModal(false);

     try {
          const res = await fetch("http://10.0.2.2:8000/requests/accept", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: selectedRequest?.id }),
          });
    
          if (!res.ok) throw new Error("Failed to accpet request");
    
          Alert.alert("Accepted");
        } catch (err) {
          Alert.alert("Error", err.message);
        }
      

      
    };
  

  const rejectRequest = async() => {
    console.log("Selected request ID to accept:", selectedRequest?.id);

   

    setMessageRequests((prev) =>
      prev.filter((msg) => msg.id !== selectedRequest.id)
    );
    setSelectedRequest(null);
    setShowModal(false);
     try {
          const res = await fetch("http://10.0.2.2:8000/requests/reject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: selectedRequest?.id }),
          });
    
          if (!res.ok) throw new Error("Failed to reject request");
    
          Alert.alert("Deleted");
        } catch (err) {
          Alert.alert("Error", err.message);
        }
     

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMessageItem({ item, isRequest: true })}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No message requests</Text>
        }
      />

      <Text style={styles.sectionTitle}>Ongoing Chats</Text>
      <FlatList
        data={ongoingMessages.sort((a, b) => b.timestamp - a.timestamp)}
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
