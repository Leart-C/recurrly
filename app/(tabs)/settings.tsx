import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Unable to sign out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      style={{ flex: 1, backgroundColor: "#fff9e3" }}
    >
      <View className="flex-1 p-5">
        <Text className="text-3xl font-sans-bold text-primary">Settings</Text>

        <View className="mt-8 rounded-3xl border border-border bg-card p-5">
          <Text className="text-lg font-sans-bold text-primary">Account</Text>
          <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
            Sign out to test the authentication flow with another account.
          </Text>

          <Pressable
            className={`mt-6 items-center rounded-2xl py-4 ${
              isSigningOut ? "bg-destructive/45" : "bg-destructive"
            }`}
            disabled={isSigningOut}
            onPress={handleSignOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base font-sans-bold text-white">Log out</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
