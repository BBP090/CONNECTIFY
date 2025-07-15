import { Stack, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'

const router = useRouter();

export default function TabsLayout() {
    return (
        <>
            <SignedIn>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: "#1a1aff",
                        headerStyle: {
                            backgroundColor: "white",
                            // borderColor: "white",
                        },
                        headerShadowVisible: true,
                        headerTintColor: "black",
                        tabBarStyle: {
                            // marginTop: 10,
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