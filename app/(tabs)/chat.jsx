import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import React, { useEffect ,useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import GetUserID from "../hooks/GetUserID";
import Fuse from 'fuse.js';


const MessageScreen = () => {
  const navigation = useNavigation();
  const { userId: userId, loading: idLoading } = GetUserID();
  const [messageRequests, setMessageRequests] = useState([]);
  const [ongoingMessages, setOngoingMessages]=useState([]);
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const router= useRouter();

  const fuse = new Fuse(ongoingMessages ?? [], {
  keys: ['name'],
  threshold: 0.3,  // Lower = more exact matches, higher = more fuzzy
  ignoreLocation: true,
  minMatchCharLength: 1,
});


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
  const [selectedOngoing, setSelectedOngoing]= useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter ongoingMessages based on searchText (case-insensitive)
  /*
  const filteredOngoing = 
  Array.isArray(ongoingMessages)
    ? ongoingMessages.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];*/

    const filteredOngoing = searchText.trim() === ''
  ? ongoingMessages ?? []
  : fuse.search(searchText).map(result => result.item);


  // Handle selecting a suggestion from autosuggest list
  const handleSuggestionPress = (item) => {
    setSearchText("");  // clear search bar
    setShowSuggestions(false);
    router.push(`/${item.id}`);
  };


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

  const handleOngoingPress = (item) => {
    console.log("Item on press:", item);
    setSelectedOngoing(item)
    //router.push("/ChatRoom");
    router.push(`/${item.id}`); // ← missing backticks, brace, and closing quote

  };

 

  const renderMessageItem = ({ item, isRequest }) => (
    <Pressable
      style={styles.messageRow}
      onPress={() =>
        isRequest ? handleRequestPress(item) : handleOngoingPress(item)
      }
    >
      <Image source={{ require: item.image }} style={styles.avatar} />
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

    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowSuggestions(false);
    }}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search ongoing chats"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setShowSuggestions(text.length > 0);
            }}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Autosuggest List */}
        {showSuggestions && filteredOngoing.length > 0 && (
          <View style={styles.suggestionBox}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={filteredOngoing}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        )}

    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Message Requests</Text>
      <FlatList
        //data={messageRequests.sort((a, b) => b.timestamp - a.timestamp)}
        data={messageRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMessageItem({ item, isRequest: true })}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No message requests</Text>
        }
      />

      <Text style={styles.sectionTitle}>Ongoing Chats</Text>
      <FlatList
        //data={ongoingMessages.sort((a, b) => b.timestamp - a.timestamp)}
        data={ongoingMessages}
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
    </View>
    </TouchableWithoutFeedback>
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
  searchContainer: {
  paddingHorizontal: 15,
  marginBottom: 8,
  marginTop: 10,
},
searchInput: {
  backgroundColor: "#fff",
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 25,
  fontSize: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
},
suggestionBox: {
  backgroundColor: "#fff",
  maxHeight: 150,
  marginHorizontal: 15,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 4,
  marginBottom: 10,
  zIndex: 999,
  position: "absolute",
  top: 70, // below search bar (adjust if needed)
  left: 0,
  right: 0,
},
suggestionItem: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderBottomColor: "#eee",
  borderBottomWidth: 1,
},
suggestionText: {
  fontSize: 16,
  color: "#333",
},

});
