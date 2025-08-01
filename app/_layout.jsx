import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { HeaderBackButton } from '@react-navigation/elements'
import { Slot } from 'expo-router'
import SessionResetter from './SessionResetter'  

export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <SessionResetter>
            <Slot />
            </SessionResetter>
        </ClerkProvider>
    )
}