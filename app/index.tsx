import { useAuth } from "@clerk/expo";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <AuthLoadingScreen />;
  }

  return <Redirect href={isSignedIn ? "/(tabs)" : "/(auth)/sign-in"} />;
}
