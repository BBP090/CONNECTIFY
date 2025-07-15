import { Stack, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'


export default function TabsLayout() {
    const router = useRouter();
    return (
        <>
            <SignedIn>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: "#008000",
                        headerTitleStyle: {
                            fontSize: 23,
                            color: "#008000"
                        },
                        headerStyle: {
                            backgroundColor: "white",
                        },
                        headerShadowVisible: true,
                        tabBarStyle: {
                            backgroundColor: "black",
                        }
                    }}>
                    <Tabs.Screen name="index" options={{
                        headerTitle: "Connectify",
                        tabBarLabel: "Home",
                        tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={20} />,
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
                            tabBarIcon: ({ focused, color }) => <MaterialIcons name={focused ? "person" : "person-outline"} color={color} size={20} />,
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
            </SignedIn>
            <SignedOut>
                <Stack>
                    <Stack.Screen name="login" />
                </Stack>
            </SignedOut>
        </>
    );
}