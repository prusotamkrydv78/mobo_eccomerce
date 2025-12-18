import { Redirect, Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@clerk/clerk-expo"
import { ActivityIndicator, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from 'expo-blur'
const TabLayout = () => {

    const { isLoaded, isSignedIn } = useAuth()
    const insets = useSafeAreaInsets()
    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#4285f4" />
            </View>)
    }
    if (!isSignedIn) {
        return <Redirect href="/(auth)" />
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#1DB954",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "bold"
                },
                tabBarStyle: {
                    backgroundColor: "transparent",
                    position: "absolute",
                    overflow: "hidden",
                    borderTopWidth: 0,
                    paddingTop: 4,
                    marginHorizontal: 60,
                    borderRadius: 10,
                    marginBottom: insets.bottom,
                    height: 50 + insets.bottom,

                },
                tabBarBackground: () => (
                    <BlurView tint="dark" intensity={80} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),

                }}
            />
             <Tabs.Screen
                name="shop"
                options={{
                    title: "Shop",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" color={color} size={size} />
                    ),

                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart" color={color} size={size} />
                    ),

                }}
            />
           
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    ),

                }}
            />
        </Tabs>
    )
}

export default TabLayout