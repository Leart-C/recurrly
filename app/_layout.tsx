import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { SplashScreen, Stack, usePathname, useGlobalSearchParams } from "expo-router";
import "@/global.css";
import { useFonts } from 'expo-font';
import { useEffect, useRef } from "react";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { posthog } from "@/lib/posthog";
import { SubscriptionsProvider } from "@/contexts/SubscriptionsContext";

void SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

function ClerkPostHogIdentifier() {
  const { isLoaded, userId } = useAuth();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (!isLoaded) return;
    if (userId) {
      posthogClient.identify(userId);
    }
  }, [isLoaded, userId, posthogClient]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  })
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(()=>{
    if(fontsLoaded){
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded])

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, { previous_screen: previousPathname.current ?? null, ...params });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!fontsLoaded) {
    return <AuthLoadingScreen message="Preparing your workspace…" />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ['testID'],
        }}
      >
        <ClerkPostHogIdentifier />
        <SubscriptionsProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SubscriptionsProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}
