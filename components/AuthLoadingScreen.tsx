import { ActivityIndicator, Text, View } from "react-native";

type AuthLoadingScreenProps = {
  message?: string;
};

export default function AuthLoadingScreen({
  message = "Restoring your session…",
}: AuthLoadingScreenProps) {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-6 size-20 items-center justify-center rounded-3xl bg-accent">
          <Text className="text-4xl font-sans-extrabold text-primary">R</Text>
        </View>
        <Text className="text-3xl font-sans-extrabold text-primary">Recurrly</Text>
        <Text className="mt-2 text-center text-base font-sans-medium text-muted-foreground">
          {message}
        </Text>
        <ActivityIndicator className="mt-8" size="large" color="#ea7a53" />
      </View>
    </View>
  );
}
