// src/screens/ReceiptScreen.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { CalculatorStackParamList } from "../../App";
import { Session } from "../types";
import { formatNumber } from "../utils/helpers";

type ReceiptScreenRouteProp = RouteProp<CalculatorStackParamList, "Receipt">;

interface Props {
  route: ReceiptScreenRouteProp;
}

const ReceiptScreen: React.FC<Props> = ({ route }) => {
  const { session } = route.params;
  const receiptRef = useRef(null);

  const handleDownload = async () => {
    // 1. Check for permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need permission to save photos to your device."
      );
      return;
    }

    try {
      // 2. Capture the view
      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
      });

      // 3. Save to media library
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success!", "Receipt image saved to your photos.");
    } catch (error) {
      console.error("Failed to save receipt:", error);
      Alert.alert("Error", "Could not save the receipt image.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View
          style={styles.receiptContainer}
          ref={receiptRef}
          collapsable={false}
        >
          <Text style={styles.title}>Purchase Receipt</Text>
          <Text style={styles.date}>
            {new Date(session.date).toLocaleString()}
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.itemCol]}>Item</Text>
            <Text style={[styles.headerText, styles.qtyCol]}>Qty</Text>
            <Text style={[styles.headerText, styles.totalCol]}>Total</Text>
          </View>

          {session.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.rowText, styles.itemCol]}>
                {item.network} {item.denomination}
              </Text>
              <Text style={[styles.rowText, styles.qtyCol]}>
                {item.quantity}
              </Text>
              <Text style={[styles.rowText, styles.totalCol]}>
                ₦{formatNumber(item.total)}
              </Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerLabel}>Overall Total</Text>
            <Text style={styles.footerTotal}>
              ₦{formatNumber(session.overallTotal)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Text style={styles.downloadButtonText}>Download Receipt</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  receiptContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 16,
    borderRadius: 8,
    // Add border for better visual capture
    borderWidth: Platform.OS === "android" ? 0 : 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  date: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 24 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  headerText: { fontWeight: "700", color: "#333" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowText: { fontSize: 16 },
  itemCol: { flex: 3 },
  qtyCol: { flex: 1, textAlign: "center" },
  totalCol: { flex: 2, textAlign: "right" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  footerLabel: { fontSize: 18, fontWeight: "600" },
  footerTotal: { fontSize: 20, fontWeight: "bold" },
  downloadButton: {
    backgroundColor: "#000",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ReceiptScreen;
