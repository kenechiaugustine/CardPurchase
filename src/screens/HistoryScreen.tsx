import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Session } from "../types";
import { CalculatorStackParamList } from "../../App";
import { formatNumber } from "../utils/helpers";
import { Swipeable } from "react-native-gesture-handler";
import ConfirmModal from "../components/ConfirmModal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type HistoryScreenNavigationProp = StackNavigationProp<
  CalculatorStackParamList,
  "History"
>;

const HistoryScreen: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
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

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      const updatedSessions = sessions.filter(
        (session) => session.id !== sessionToDelete
      );

      await AsyncStorage.setItem(
        "sessionsHistory",
        JSON.stringify(updatedSessions)
      );

      setSessions(updatedSessions);
    } catch (error) {
      console.error("Failed to delete session:", error);
    } finally {
      setDeleteModalVisible(false);
      setSessionToDelete(null);
    }
  };

  const renderRightActions = (sessionId: number) => {
    const handlePress = () => {
      setSessionToDelete(sessionId);
      setDeleteModalVisible(true);
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity
                style={styles.sessionItem}
                onPress={() =>
                  navigation.navigate("Receipt", { session: item })
                }
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
            </Swipeable>
          )}
          contentContainerStyle={styles.listContainer}
        />

        <ConfirmModal
          visible={isDeleteModalVisible}
          title="Confirm Deletion"
          message="Are you sure you want to permanently delete this session?"
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={handleConfirmDelete}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
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
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderRadius: 12,
    marginBottom: 12,
    height: "100%",
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default HistoryScreen;
