import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
    {/* <StatusBar style="light" /> */}
      <Stack screenOptions={
        headerStyle={
          backgroundColor: "white",
        }
      }>
        {/* <Stack.Screen name="loginForm" options={{
          headerTitle: "Connectify",
        }} /> */}
        <Stack.Screen name="(tabs)" options={{
          headerShown: false,
        }} />
        <Stack.Screen name="+not-found" options={{
          headerTitle: "NOT FOUND",
          headerShown: false,
        }} />
      </Stack>
    </>
  );
}

{
  // When a route doesn't exist, we can use a +not-found route to display a fallback screen. This is useful when we want to display a custom screen when navigating to an invalid route on mobile instead of crashing the app or display a 404 error on web. Expo Router uses a special +not-found.tsx file to handle this case.
  /* <Stack.Screen
  name="text"
  //value of the name prop must match with the name of the route files to apply the modifications 
  options={{
    headerTitle: "Text",
    // to change the title of the header
    headerLeft: () => <></>
    // to remove the back button from the header
  }} /> */}