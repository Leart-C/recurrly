import type Fontisto from "@expo/vector-icons/Fontisto";
import type { ComponentProps } from "react";

export type SubscriptionBrandIcon = {
  family: "fontisto";
  name: ComponentProps<typeof Fontisto>["name"];
  color: string;
};

const BRAND_MATCHERS: Array<{
  keywords: string[];
  icon: SubscriptionBrandIcon;
}> = [
  { keywords: ["netflix"], icon: { family: "fontisto", name: "netflix", color: "#E50914" } },
  { keywords: ["spotify"], icon: { family: "fontisto", name: "spotify", color: "#1DB954" } },
  { keywords: ["adobe"], icon: { family: "fontisto", name: "adobe", color: "#FF0000" } },
  { keywords: ["github"], icon: { family: "fontisto", name: "github", color: "#181717" } },
  { keywords: ["dropbox"], icon: { family: "fontisto", name: "dropbox", color: "#0061FF" } },
  { keywords: ["youtube"], icon: { family: "fontisto", name: "youtube-play", color: "#FF0000" } },
  { keywords: ["amazon", "prime video", "prime"], icon: { family: "fontisto", name: "amazon", color: "#FF9900" } },
  { keywords: ["apple music"], icon: { family: "fontisto", name: "applemusic", color: "#FA243C" } },
  { keywords: ["icloud", "apple"], icon: { family: "fontisto", name: "apple", color: "#111111" } },
  { keywords: ["google drive"], icon: { family: "fontisto", name: "google-drive", color: "#4285F4" } },
  { keywords: ["google"], icon: { family: "fontisto", name: "google", color: "#4285F4" } },
  { keywords: ["slack"], icon: { family: "fontisto", name: "slack", color: "#4A154B" } },
  { keywords: ["discord"], icon: { family: "fontisto", name: "discord", color: "#5865F2" } },
  { keywords: ["microsoft", "office 365", "onedrive"], icon: { family: "fontisto", name: "microsoft", color: "#F25022" } },
];

export const getSubscriptionBrandIcon = (subscriptionName: string) => {
  const normalizedName = subscriptionName.trim().toLocaleLowerCase();

  return BRAND_MATCHERS.find(({ keywords }) =>
    keywords.some((keyword) => normalizedName.includes(keyword)),
  )?.icon;
};
