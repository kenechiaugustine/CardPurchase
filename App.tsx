// App.tsx
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // Import StackNavigator
import AsyncStorage from "@react-native-async-storage/async-storage";

import CalculatorScreen from "./src/screens/CalculatorScreen";
import PricesScreen from "./src/screens/PricesScreen";

import { defaultPrices } from "./src/constants";
import { PriceMap, Session } from "./src/types";
import HistoryScreen from "./src/screens/HistoryScreen";
import ReceiptScreen from "./src/screens/ReceiptScreen";

// Define Stack Navigator types
export type CalculatorStackParamList = {
  Calculator: { prices: PriceMap };
  History: undefined;
  Receipt: { session: Session };
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<CalculatorStackParamList>();

// Create a new component for the Calculator Stack
function CalculatorStack({ prices }: { prices: PriceMap }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calculator" options={{ headerShown: false }}>
        {() => <CalculatorScreen prices={prices} />}
      </Stack.Screen>
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "History" }}
      />
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{ title: "Session Receipt" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [prices, setPrices] = useState<PriceMap>(defaultPrices);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("prices");
      if (stored) setPrices(JSON.parse(stored));
    };
    load();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Calculator" options={{ headerShown: false }}>
          {() => <CalculatorStack prices={prices} />}
        </Tab.Screen>
        <Tab.Screen name="Prices">
          {() => <PricesScreen prices={prices} setPrices={setPrices} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
