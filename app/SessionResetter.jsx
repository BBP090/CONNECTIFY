import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function SessionResetter({ children }) {
  const { sessionId } = useAuth()
  const [key, setKey] = useState(0)

  useEffect(() => {
    // Reset global state or caches here if needed
    resetAppState()

    // Increment key to force remount of children (clear state)
    setKey(prev => prev + 1)
  }, [sessionId])

  return React.cloneElement(children, { key })
}

async function resetAppState() {
  // Add your reset logic here:
  // e.g. clear Zustand stores, AsyncStorage, React Query caches
  // Example:
  // chatStore.reset()
  // AsyncStorage.clear()
  try {
    // Clear AsyncStorage (persistent local storage)
    await AsyncStorage.clear()

    // Reset Zustand or Redux stores if you use them
    // chatStore.reset()
    // userStore.reset()

    // Reset React Query cache if you use it
    // queryClient.clear()

    console.log('App state reset successfully')
  } catch (error) {
    console.error('Error resetting app state:', error)
  }
}
