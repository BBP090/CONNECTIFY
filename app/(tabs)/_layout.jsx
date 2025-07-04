import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
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
                    backgroundColor: "black",
                }
            }}>
            <Tabs.Screen name="loginForm" options={{
                headerTitle: "Connectify",
                headerTintColor: "black",
            }} />
            <Tabs.Screen name="Home" options={{
                headerTitle: "Connectify",
                headerTintColor: "black",
            }} />
            <Tabs.Screen name="index" options={{
                headerTitle: "Home",
                tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={20} />,
            }} />
            <Tabs.Screen
                name="chat"
                options={{
                    headerTitle: "Chats",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "chatbubble-sharp" : "chatbubble-outline"} color={color} size={20} />
                }} />
        </Tabs>);
}