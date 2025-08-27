import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { formatNumber } from "../utils/helpers";

interface CardItemProps {
  network: string;
  denomination: number;
  value: string;
  onChange: (text: string) => void;
  total: number;
}

const CardItem: React.FC<CardItemProps> = ({
  network,
  denomination,
  value,
  onChange,
  total,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {network} {denomination}
      </Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Enter quantity"
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
      <Text style={styles.total}>₦{formatNumber(total)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    gap: 50,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flex: 1,
    width: 60,
    textAlign: "center",
  },
  total: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default CardItem;
