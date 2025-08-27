import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Session } from "../types";
import { CalculatorStackParamList } from "../../App";
import { formatNumber } from "../utils/helpers";

type HistoryScreenNavigationProp = StackNavigationProp<
  CalculatorStackParamList,
  "History"
>;

const HistoryScreen: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const storedSessions = await AsyncStorage.getItem("sessionsHistory");
      if (storedSessions) {
        const parsedSessions: Session[] = JSON.parse(storedSessions);
        parsedSessions.sort((a, b) => b.id - a.id);
        setSessions(parsedSessions);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No saved sessions yet.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sessionItem}
            onPress={() => navigation.navigate("Receipt", { session: item })}
          >
            <View>
              <Text style={styles.sessionDate}>
                {new Date(item.date).toLocaleString()}
              </Text>
              <Text style={styles.sessionInfo}>
                {item.items.length} item(s)
              </Text>
            </View>
            <Text style={styles.sessionTotal}>
              ₦{formatNumber(item.overallTotal)}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
  listContainer: { padding: 16 },
  sessionItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  sessionDate: { fontSize: 16, fontWeight: "600" },
  sessionInfo: { fontSize: 14, color: "#555", marginTop: 4 },
  sessionTotal: { fontSize: 18, fontWeight: "700" },
});

export default HistoryScreen;
