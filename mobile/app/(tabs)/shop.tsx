
import ProductGrid from '@/components/ProductGrid';
import SafeScreenView from '@/components/SafeScreenView'
import useProducts from '@/hooks/useProducts';

import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native'
const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];
const ShopTab = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  const {data:products, isLoading, isError} = useProducts()

  console.log(products);
  if(products)
  {
    
  }
  return (
    <SafeScreenView>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='px-6 pb-4 pt-6'>
          {/* HEADER PART  */}
          <View className='flex-row items-center justify-between mb-6'>
            <View>
              <Text className='text-text-primary text-3xl tracking-tighter font-bold'>Shop</Text>
              <Text className='text-text-secondary text-sm mt-2 '>Browse all products </Text>
            </View>
            <TouchableOpacity className='bg-surface/50 p-3 rounded-2xl' activeOpacity={0.5} >
              <Ionicons name='options-outline' size={22} color={"#fff"} />
            </TouchableOpacity>

          </View>

          {/* SEARCH AREA */}
          <View className='bg-surface flex-row items-center px-4 py-2 rounded-2xl'>
            <Ionicons color={"#666"} size={22} name='search' />
            <TextInput placeholder='Search for products'
              placeholderTextColor={"#666"}
              className='flex-1 ml-2 textb-base text-text-primary'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

          </View>
          {/*   CATEGORY FILTER */}
          <View className='mt-4'>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            >

              {
                CATEGORIES.map(category => {
                  const isSelected = selectedCategory === category.name;
                  return (
                    <TouchableOpacity key={category.name}
                      onPress={() => setSelectedCategory(category.name)}
                      className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? "bg-primary" : "bg-surface"}`}
                    >
                      {
                        category.icon ? (
                          <Ionicons name={category.icon} size={36} color={isSelected ? "#121212" : "#fff"} />
                        ) : (
                          <Image source={category.image} className='size-12' resizeMode='contain' />
                        )
                      }

                    </TouchableOpacity>
                  )
                })
              }

            </ScrollView>
          </View>

          <View className='px-2 my-4 '>
            <View className='flex-row items-center justify-between mb-4'>
              <Text className='font-bold text-lg text-text-primary'>Products</Text>
              <Text className='font-bold text-sm text-text-secondary'>10</Text>
            </View>
          </View>

          {/* PRODUCT GRID */}
          <ProductGrid/>
        </View>
      </ScrollView>
    </SafeScreenView>
  )
}

export default ShopTab