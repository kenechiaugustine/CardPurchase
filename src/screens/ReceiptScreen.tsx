import React, { useRef } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

import { CalculatorStackParamList } from "../../App";
import ReceiptView from "../components/ReceiptView";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type ReceiptScreenRouteProp = RouteProp<CalculatorStackParamList, "Receipt">;

interface Props {
  route: ReceiptScreenRouteProp;
}

const ReceiptScreen: React.FC<Props> = ({ route }) => {
  const { session } = route.params;
  const receiptRef = useRef<View>(null);

  const handleDownload = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need permission to save photos to your device."
      );
      return;
    }
    try {
      if (receiptRef.current) {
        const uri = await captureRef(receiptRef, { format: "png", quality: 1 });
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Success!", "Receipt image saved to your photos.");
      }
    } catch (error) {
      console.error("Failed to save receipt:", error);
      Alert.alert("Error", "Could not save the receipt image.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <ReceiptView session={session} ref={receiptRef} />
        </ScrollView>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
        >
          <Text style={styles.downloadButtonText}>Download As Image</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  downloadButton: {
    backgroundColor: "#000",
    padding: 12,
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
