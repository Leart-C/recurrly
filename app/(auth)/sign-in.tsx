import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { posthog } from "@/lib/posthog";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const finishSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.warn("Clerk session task requires attention:", session.currentTask);
          return;
        }

        posthog.capture('user_signed_in', { method: 'password' });
        router.replace(decorateUrl("/(tabs)") as Href);
      },
    });
  };

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === "complete") {
      await finishSignIn();
      return;
    }

    if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) await signIn.mfa.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === "complete") await finishSignIn();
  };

  const isLoading = fetchStatus === "fetching";
  const needsVerification = signIn.status === "needs_client_trust";

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      style={{ flex: 1, backgroundColor: "#fff9e3" }}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        style={{ flex: 1, backgroundColor: "#fff9e3" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow px-5 pb-10 pt-8"
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 32, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-2 items-center">
            <View className="mb-7 flex-row items-center gap-3">
              <View className="size-14 items-center justify-center rounded-2xl bg-accent">
                <Text className="text-2xl font-sans-extrabold text-background">R</Text>
              </View>
              <View>
                <Text className="text-3xl font-sans-extrabold text-primary">Recurrly</Text>
                <Text className="-mt-1 text-xs font-sans-semibold uppercase tracking-[1px] text-muted-foreground">subscriptions, simplified</Text>
              </View>
            </View>
            <Text className="text-3xl font-sans-bold text-primary">
              {needsVerification ? "Verify your account" : "Welcome back"}
            </Text>
            <Text className="mt-2 max-w-[320px] text-center text-base font-sans-medium text-muted-foreground">
              {needsVerification
                ? "Enter the security code Clerk sent to your email."
                : "Sign in to keep all your subscriptions in one place."}
            </Text>
          </View>

          <View className="mt-8 rounded-3xl border border-border bg-card p-5">
            {needsVerification ? (
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-sans-semibold text-primary">Verification code</Text>
                  <TextInput
                    className="rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary"
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter code"
                    placeholderTextColor="#7a7467"
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                  />
                  {errors.fields.code && (
                    <Text className="text-xs font-sans-medium text-destructive">{errors.fields.code.message}</Text>
                  )}
                </View>
                <Pressable
                  className={`mt-1 items-center rounded-2xl py-4 ${isLoading || !code ? "bg-accent/45" : "bg-accent"}`}
                  disabled={isLoading || !code}
                  onPress={handleVerify}
                >
                  {isLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text className="text-base font-sans-bold text-primary">Verify</Text>
                  )}
                </Pressable>
                <Pressable className="items-center rounded-2xl border border-accent/30 bg-accent/10 py-3" onPress={() => signIn.mfa.sendEmailCode()}>
                  <Text className="text-sm font-sans-semibold text-accent">Send a new code</Text>
                </Pressable>
                <Pressable className="items-center rounded-2xl border border-accent/30 bg-accent/10 py-3" onPress={() => signIn.reset()}>
                  <Text className="text-sm font-sans-semibold text-accent">Start over</Text>
                </Pressable>
              </View>
            ) : (
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-sans-semibold text-primary">Email address</Text>
                  <TextInput
                    className="rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    placeholder="you@example.com"
                    placeholderTextColor="#7a7467"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    keyboardType="email-address"
                  />
                  {errors.fields.identifier && (
                    <Text className="text-xs font-sans-medium text-destructive">{errors.fields.identifier.message}</Text>
                  )}
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-sans-semibold text-primary">Password</Text>
                  <TextInput
                    className="rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#7a7467"
                    autoComplete="current-password"
                    secureTextEntry
                  />
                  {errors.fields.password && (
                    <Text className="text-xs font-sans-medium text-destructive">{errors.fields.password.message}</Text>
                  )}
                </View>
                <Pressable
                  className={`mt-1 items-center rounded-2xl py-4 ${isLoading || !emailAddress || !password ? "bg-accent/45" : "bg-accent"}`}
                  disabled={isLoading || !emailAddress || !password}
                  onPress={handleSubmit}
                >
                  {isLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text className="text-base font-sans-bold text-primary">Sign in</Text>
                  )}
                </Pressable>
                <View className="mt-5 flex-row items-center justify-center gap-1">
                  <Text className="text-sm font-sans-medium text-muted-foreground">New to Recurrly?</Text>
                  <Link href="/(auth)/sign-up" className="text-sm font-sans-bold text-accent">Create an account</Link>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
