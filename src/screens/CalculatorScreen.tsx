import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PriceMap, Session, SessionItem } from "../types";
import CardItem from "../components/CardItem";
import { formatNumber, parseFraction } from "../utils/helpers";
import { CalculatorStackParamList } from "../../App";
import ConfirmModal from "../components/ConfirmModal";

type CalculatorScreenNavigationProp = StackNavigationProp<
  CalculatorStackParamList,
  "Calculator"
>;

interface Props {
  prices: PriceMap;
}

const CalculatorScreen: React.FC<Props> = ({ prices }) => {
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<CalculatorScreenNavigationProp>();

  const handleChange = (network: string, denom: number, value: string) => {
    setQuantities((prev) => ({
      ...prev,
      [`${network}-${denom}`]: value,
    }));
  };

  const calcTotal = (network: string, denom: number): number => {
    const key = `${network}-${denom}`;
    const qty = parseFraction(quantities[key] || "");
    return prices[network as keyof PriceMap][denom] * qty;
  };

  const overallTotal = Object.keys(quantities).reduce((sum, key) => {
    const [network, denom] = key.split("-");
    const qtyStr = quantities[key];
    if (qtyStr && parseFraction(qtyStr) > 0) {
      return sum + calcTotal(network, Number(denom));
    }
    return sum;
  }, 0);

  const handleSaveSession = async () => {
    setModalVisible(false);
    const items: SessionItem[] = Object.keys(quantities)
      .map((key) => {
        const [network, denomStr] = key.split("-");
        const denom = Number(denomStr);
        const quantity = quantities[key];
        const total = calcTotal(network, denom);

        if (quantity && parseFraction(quantity) > 0) {
          return {
            network,
            denomination: denom,
            quantity,
            price: prices[network as keyof PriceMap][denom],
            total,
          };
        }
        return null;
      })
      .filter((item): item is SessionItem => item !== null);

    if (items.length === 0) {
      Alert.alert("Empty Items", "Please add quantities before saving.");
      return;
    }

    const newSession: Session = {
      id: Date.now(),
      date: new Date().toISOString(),
      items,
      overallTotal,
    };

    try {
      // 3. Get existing history and add the new session
      const existingHistory = await AsyncStorage.getItem("sessionsHistory");
      const history: Session[] = existingHistory
        ? JSON.parse(existingHistory)
        : [];
      history.push(newSession);
      await AsyncStorage.setItem("sessionsHistory", JSON.stringify(history));

      // 4. Clear current quantities and navigate to receipt
      setQuantities({});
      navigation.navigate("Receipt", { session: newSession });
    } catch (error) {
      console.error("Failed to save session:", error);
      Alert.alert("Error", "Could not save the session.");
    }
  };

  const attemptToSave = () => {
    // Check for items *before* showing the confirmation modal
    const hasItems = Object.values(quantities).some(
      (q) => q && parseFraction(q) > 0
    );

    if (!hasItems) {
      Alert.alert("Empty Items", "Please add quantities before saving.");
      return;
    }

    // If there are items, show the modal
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        {/* MODIFIED HEADER */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setQuantities({})}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("History")}
            style={styles.historyButton}
          >
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.totalText}>₦{formatNumber(overallTotal)}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 150 }} // Increased padding
          keyboardShouldPersistTaps="handled"
        >
          {Object.keys(prices).map((network) => (
            <View key={network} style={styles.section}>
              <Text style={styles.sectionTitle}>{network}</Text>
              {Object.keys(prices[network as keyof PriceMap]).map((denom) => {
                const key = `${network}-${denom}`;
                return (
                  <CardItem
                    key={key}
                    network={network}
                    denomination={Number(denom)}
                    value={quantities[key] || ""}
                    onChange={(text) =>
                      handleChange(network, Number(denom), text)
                    }
                    total={calcTotal(network, Number(denom))}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={attemptToSave}>
          <Text style={styles.saveButtonText}>Save Session</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleSaveSession}
        title="Confirm Save"
        message="Are you sure you want to save this session? This action will clear the current entries."
      />
    </SafeAreaView>
  );
};

// --- UPDATE STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 16,
    backgroundColor: "#fafafa",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalText: { fontSize: 20, fontWeight: "700", textAlign: "right", flex: 1 },
  clearButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  historyButton: {
    backgroundColor: "#e0f7fa",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  historyButtonText: {
    color: "#00796b",
    fontWeight: "600",
  },
  scroll: { padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CalculatorScreen;
