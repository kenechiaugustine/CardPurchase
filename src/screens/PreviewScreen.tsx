import React, { useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

import { CalculatorStackParamList } from "../../App";
import { Session } from "../types";
import ReceiptView from "../components/ReceiptView";

type PreviewScreenRouteProp = RouteProp<CalculatorStackParamList, "Preview">;
type PreviewScreenNavigationProp = StackNavigationProp<
  CalculatorStackParamList,
  "Preview"
>;

interface Props {
  route: PreviewScreenRouteProp;
}

const PreviewScreen: React.FC<Props> = ({ route }) => {
  const { session } = route.params;
  const navigation = useNavigation<PreviewScreenNavigationProp>();
  const receiptRef = useRef<View>(null);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSaveSession = async () => {
    try {
      const existingHistory = await AsyncStorage.getItem("sessionsHistory");
      const history: Session[] = existingHistory
        ? JSON.parse(existingHistory)
        : [];
      history.push(session);
      await AsyncStorage.setItem("sessionsHistory", JSON.stringify(history));

      setIsSaved(true); 
      Alert.alert(
        "Session Saved",
        "Your session has been saved successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Failed to save session:", error);
      Alert.alert("Error", "Could not save the session.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <ReceiptView session={session} ref={receiptRef} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
        >
          <Text style={styles.downloadButtonText}>Download As Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.disabledButton]}
          onPress={handleSaveSession}
          disabled={isSaved}
        >
          <Text style={styles.saveButtonText}>
            {isSaved ? "Saved" : "Save For Later"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  downloadButton: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  downloadButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
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
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default PreviewScreen;
