import "@/global.css"
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { posthog } from "@/lib/posthog";
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import {icons} from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import { useState } from "react";
import { useSubscriptions } from "@/contexts/SubscriptionsContext";


const SafeAreaView = styled(RNSafeAreaView);
 
export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { subscriptions, addSubscription } = useSubscriptions();

  const handleCreateSubscription = (subscription: Subscription) => {
    addSubscription(subscription);
    posthog.capture("subscription_created", {
      subscription_id: subscription.id,
      category: subscription.category ?? "Other",
      billing: subscription.billing,
    });
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-background p-5">
    
        <ListHeading title="All Subscriptions" />

        <FlatList
          ListHeaderComponent={() => (
            <>
              <View className="home-header">
                <View className="home-user">
                  <Image source={images.avatar} className="home-avatar" />
                  <Text className="home-user-name">{HOME_USER.name}</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add subscription"
                  onPress={() => setIsCreateModalVisible(true)}
                >
                  <Image source={icons.add} className="home-add-icon" />
                </Pressable>
              </View>

              <View className="home-balance-card">
                  <Text className="home-balance-label">Balance</Text>

                  <View className="home-balance-row">
                    <Text className="home-balance-amount">
                      {formatCurrency(HOME_BALANCE.amount)}
                    </Text>
                    <Text className="home-balance-date">
                      {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                    </Text>
                  </View>
              </View>

              <View className="mb-5">
                <ListHeading title="Upcoming Subscriptions" />
                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  keyExtractor={(item)=>item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                  renderItem={({item})=>(
                    <UpcomingSubscriptionCard {...item}/>
                  )}/>
              </View>
            </>
          )} 
          data={subscriptions}
          keyExtractor={(item)=>item.id}
          renderItem={({item})=>(<SubscriptionCard {...item} expanded={expandedSubscriptionId === item.id} onPress={() => {
            const isExpanding = expandedSubscriptionId !== item.id;
            setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id));
            if (isExpanding) {
              posthog.capture('subscription_expanded', { subscription_id: item.id });
            }
          }}/>)}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={()=><View className="h-4"/>}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
          contentContainerStyle={{paddingBottom: 50}}
        />

      </SafeAreaView>

      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateSubscription}
      />
    </>
  );
}
