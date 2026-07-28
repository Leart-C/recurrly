import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/contexts/SubscriptionsContext";
import { posthog } from "@/lib/posthog";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Subscriptions() {
  const [query, setQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptions();

  useEffect(() => {
    posthog.capture("subscription_list_viewed");
  }, []);

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) return subscriptions;

    return subscriptions.filter((subscription) =>
      [
        subscription.name,
        subscription.plan,
        subscription.category,
        subscription.billing,
        subscription.status,
      ].some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)),
    );
  }, [query, subscriptions]);

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      style={{ flex: 1, backgroundColor: "#fff9e3" }}
    >
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 120 }}
        ListHeaderComponent={
          <View className="pb-6 pt-3">
            <Text className="text-3xl font-sans-bold text-primary">Subscriptions</Text>
            <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
              Search and review your recurring payments.
            </Text>

            <View className="mt-6 flex-row items-center rounded-2xl border border-border bg-card px-4">
              <Text className="mr-3 text-lg text-muted-foreground">⌕</Text>
              <TextInput
                className="h-14 flex-1 text-base font-sans-medium text-primary"
                value={query}
                onChangeText={setQuery}
                placeholder="Search subscriptions"
                placeholderTextColor="#7a7467"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  className="ml-2 size-8 items-center justify-center rounded-full bg-muted"
                  onPress={() => setQuery("")}
                >
                  <Text className="text-base font-sans-bold text-primary">×</Text>
                </Pressable>
              )}
            </View>

            <Text className="mt-4 text-sm font-sans-semibold text-muted-foreground">
              {filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? "subscription" : "subscriptions"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanding = expandedSubscriptionId !== item.id;
              setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id));

              if (isExpanding) {
                posthog.capture("subscription_expanded", { subscription_id: item.id });
              }
            }}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-8 pb-24">
            <Text className="text-xl font-sans-bold text-primary">No subscriptions found</Text>
            <Text className="mt-2 text-center text-sm font-sans-medium text-muted-foreground">
              Try searching by name, plan, category, billing cycle, or status.
            </Text>
            <Pressable className="mt-5 rounded-full bg-accent px-5 py-3" onPress={() => setQuery("")}>
              <Text className="font-sans-bold text-primary">Clear search</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}
