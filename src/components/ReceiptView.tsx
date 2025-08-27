import React, { forwardRef } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Session } from "../types";
import { formatNumber } from "../utils/helpers";

interface ReceiptViewProps {
  session: Session;
}

const ReceiptView = forwardRef<View, ReceiptViewProps>(({ session }, ref) => {
  return (
    <View style={styles.receiptContainer} ref={ref} collapsable={false}>
      <Text style={styles.title}>Purchase Details</Text>
      <Text style={styles.date}>{new Date(session.date).toLocaleString()}</Text>

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
          <Text style={[styles.rowText, styles.qtyCol]}>{item.quantity}</Text>
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
  );
});

const styles = StyleSheet.create({
  receiptContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
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
});

export default ReceiptView;
