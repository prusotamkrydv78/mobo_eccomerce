
import SafeScreenView from '@/components/SafeScreenView'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'

const HomeTab = () => {
  const [searchQuery,setSearchQuery] = useState("")
  console.log({searchQuery})
  return (
    <SafeScreenView>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
         <Text className='text-2xl text-white'>Hello Home</Text>
      </ScrollView>
    </SafeScreenView>
  )
}

export default HomeTab