import { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { BASE_URL } from "../../config/config";
import useGetUserID from "../hooks/useGetUserID";

const Search = () => {
  const { userId, loading: idLoading } = useGetUserID();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchNearbyUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/nearby_users?userId=${userId}`);
        const data = await res.json();
        setUsers(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyUsers();
  }, [userId]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = users.filter((user) =>
      user.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  if (loading || idLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users"
        value={searchText}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.distance}>{item.distance.toFixed(2)} km away</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchInput: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10
  },
  userCard: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  },
  distance: {
    color: "#666"
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
