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
} from "react-native";
import { PriceMap } from "../types";
import CardItem from "../components/CardItem";
import { formatNumber, parseFraction } from "../utils/helpers";

interface Props {
  prices: PriceMap;
}

const CalculatorScreen: React.FC<Props> = ({ prices }) => {
  const [quantities, setQuantities] = useState<Record<string, string>>({});

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
    return sum + calcTotal(network, Number(denom));
  }, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => setQuantities({})}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
        <Text style={styles.totalText}>₦{formatNumber(overallTotal)}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 70 }}
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
    </SafeAreaView>
  );
};

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalText: { fontSize: 20, fontWeight: "700", textAlign: "right" },
  clearButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  scroll: { padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});

export default CalculatorScreen;
