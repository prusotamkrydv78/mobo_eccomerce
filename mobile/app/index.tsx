import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello World At React Native</Text>
      <Text>This app is developed by Prusotam</Text>
      <Text>Thanks for using it </Text>
      <Text>We will love to see you again ❤️❤️❤️</Text>
      <Button title="Click me" />
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>
    </View>
  );
}
