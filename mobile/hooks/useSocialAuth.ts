import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";


const useSocialAuth = ()=>{
    const [isLoading,setIsLoading] = useState(false);
    const {startSSOFlow}= useSSO()
    const handleSocialAuth = async (strategy:"oauth_google")=>{
        setIsLoading(true)
        try {
            console.log("helo ")
           const {createdSessionId,setActive}= await startSSOFlow({strategy})
           if(createdSessionId && setActive){
            await setActive({session:createdSessionId})
           }
        } catch (error) {
            console.log("🐛🐛🐛Error in Social Auth ",error)

            Alert.alert("Error in Social Auth ","Please try again later")
            
        }finally{
            setIsLoading(false)
        }

    }

    return {isLoading,handleSocialAuth}

}
export default useSocialAuth;