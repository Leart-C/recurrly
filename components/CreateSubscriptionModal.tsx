import { icons } from "@/constants/icons";
import { getSubscriptionBrandIcon } from "@/lib/subscriptionIcons";
import cslx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type Frequency = "Monthly" | "Yearly";

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORIES)[number], string> = {
  Entertainment: "#f8c8dc",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#b8e8d0",
  Cloud: "#b9dcf2",
  Music: "#c7e8c0",
  Other: "#eee4cf",
};

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Entertainment");

  const parsedPrice = Number.parseFloat(price.replace(",", "."));
  const isValid = name.trim().length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const now = dayjs();
    const normalizedName = name.trim();
    const idBase = normalizedName
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    onCreate({
      id: `${idBase || "subscription"}-${Date.now()}`,
      name: normalizedName,
      price: parsedPrice,
      currency: "USD",
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate: now.add(1, frequency === "Monthly" ? "month" : "year").toISOString(),
      icon: icons.wallet,
      brandIcon: getSubscriptionBrandIcon(normalizedName),
      frequency,
      billing: frequency,
      color: CATEGORY_COLORS[category],
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="modal-overlay"
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable className="flex-1" onPress={handleClose} />

        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable
              className="modal-close"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
              accessibilityRole="button"
              accessibilityLabel="Close new subscription form"
              onPress={handleClose}
            >
              <Text
                className="modal-close-text"
                style={{ width: 20, lineHeight: 20, textAlign: "center" }}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="modal-body"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="auth-field gap-1">
              <Text className="auth-label">Name</Text>
              <TextInput
                className="auth-input py-2.5"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Netflix"
                placeholderTextColor="#7a7467"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View className="auth-field gap-1">
              <Text className="auth-label">Price</Text>
              <TextInput
                className="auth-input py-2.5"
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#7a7467"
                keyboardType="decimal-pad"
              />
            </View>

            <View className="auth-field gap-1">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                {(["Monthly", "Yearly"] as const).map((option) => {
                  const isActive = frequency === option;

                  return (
                    <Pressable
                      key={option}
                      className={cslx("picker-option py-2", isActive && "picker-option-active")}
                      onPress={() => setFrequency(option)}
                    >
                      <Text
                        className={cslx(
                          "picker-option-text",
                          isActive && "picker-option-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="auth-field gap-1">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {CATEGORIES.map((option) => {
                  const isActive = category === option;

                  return (
                    <Pressable
                      key={option}
                      className={cslx("category-chip px-2.5 py-1", isActive && "category-chip-active")}
                      onPress={() => setCategory(option)}
                    >
                      <Text
                        className={cslx(
                          "category-chip-text text-xs",
                          isActive && "category-chip-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              className={cslx("auth-button py-2.5", !isValid && "auth-button-disabled")}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text className="auth-button-text">Add subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
