import useSocialAuth from "@/hooks/useSocialAuth" 
import { View,Text, Image,Button, TouchableOpacity, ActivityIndicator } from "react-native"

const AuthScreen = ()=>{
    const {isLoading,handleSocialAuth}= useSocialAuth()
    
    return(
        <View className="flex-1 items-center justify-center px-8">
            <Image source={require("../../assets/images/auth-image.png")} className="size-96" resizeMode="contain" />

            <View className="gap-2 mt-4">   
                <TouchableOpacity 
                className="flex-row items-center justify-center bg-white border-gray-300 rounded-full px-6"
                onPress={()=>console.log("helo")}
                disabled={isLoading}
                >
                   {
                    isLoading?(
                        <ActivityIndicator size="small" color="#4285f4" />
                    ):(
                        <View className="flex-row items-center gap-2" >
                            <Image  source={require("../../assets/images/google.png")} className="size-10 mr-3" resizeMode="contain" />
                            <Text className="text-black font-medium text-base">Continue with Google</Text>
                        </View>
                        
                    )
                   }
                </TouchableOpacity>
            </View>
            <View>
                <Text className="text-center text-gray-500 text-xs leading-4 mt-6 p-4">
                    By signing up, you agree to our <Text className="text-blue-400">Terms</Text>, <Text className="text-blue-400">Privacy Policy</Text>, and <Text className="text-blue-400">Cookie Policy</Text>

                </Text>
            </View>
        </View>
    )

}

export default AuthScreen