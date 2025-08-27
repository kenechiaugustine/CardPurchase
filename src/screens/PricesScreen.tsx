import React from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PriceMap } from "../types";

interface Props {
  prices: PriceMap;
  setPrices: (p: PriceMap) => void;
}

const PricesScreen: React.FC<Props> = ({ prices, setPrices }) => {
  const handlePriceChange = async (
    network: string,
    denom: number,
    value: string
  ) => {
    const updated: PriceMap = {
      ...prices,
      [network]: {
        ...prices[network as keyof PriceMap],
        [denom]: parseInt(value) || 0,
      },
    };
    setPrices(updated);
    await AsyncStorage.setItem("prices", JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 90 }}
          keyboardShouldPersistTaps="handled"
        >
          {Object.keys(prices).map((network) => (
            <View key={network} style={styles.section}>
              <Text style={styles.sectionTitle}>{network}</Text>
              {Object.keys(prices[network as keyof PriceMap]).map((denom) => (
                <View key={`${network}-${denom}`} style={styles.row}>
                  <Text style={styles.label}>{denom}</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={String(
                      prices[network as keyof PriceMap][Number(denom)]
                    )}
                    onChangeText={(text) =>
                      handlePriceChange(network, Number(denom), text)
                    }
                    style={styles.input}
                  />
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
  scroll: { padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 80,
    textAlign: "center",
  },
});

export default PricesScreen;
