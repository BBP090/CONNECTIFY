import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function TabsLayout() {
    const router = useRouter();
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#1a1aff",
                    headerStyle: {
                        backgroundColor: "grey",
                        borderColor: "white",
                    },
                    headerShadowVisible: true,
                    headerTintColor: "black",
                    tabBarStyle: {
                        marginTop: 10,
                        backgroundColor: "black"
                    }
                }}>
                <Tabs.Screen name="loginForm" options={{
                    headerTitle: "Connectify",
                    headerTintColor: "black",
                }} />
                <Tabs.Screen name="index" options={{
                    headerTitle: "Home",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={20} />,
                }} />
                <Tabs.Screen name="Home" options={{
                    headerTitle: "Connectify",
                    headerTintColor: "black",
                }} />
                <Tabs.Screen
                    name="chat"
                    options={{
                        headerTitle: "Chats",
                        tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "chatbubble-sharp" : "chatbubble-outline"} color={color} size={20} />
                    }} />
                <Tabs.Screen
                    name="profile"
                    options={{
                        headerTitle: 'Profile',
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => router.push('/setting')}
                                style={{ marginRight: 15 }}
                            >
                                <Ionicons name="settings-outline" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Tabs>
        </GestureHandlerRootView>

    );
}