import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Link, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';

const SubscriptionDetails = () => {
    const {id} = useLocalSearchParams<{id: string}>();
    const posthog = usePostHog();

    useEffect(() => {
      posthog.capture('subscription_viewed', { subscription_id: id });
    }, [posthog, id]);

  return (
    <View>
      <Text>Subscription Details: {id}</Text>
      <Link href='/'>Go back</Link>
    </View>
  )
}

export default SubscriptionDetails