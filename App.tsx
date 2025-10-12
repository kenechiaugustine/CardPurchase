import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalculatorScreen from "./src/screens/CalculatorScreen";
import PricesScreen from "./src/screens/PricesScreen";
import { defaultPrices } from "./src/constants";
import { PriceMap, Session } from "./src/types";
import HistoryScreen from "./src/screens/HistoryScreen";
import ReceiptScreen from "./src/screens/ReceiptScreen";
import PreviewScreen from "./src/screens/PreviewScreen";
import CalculatorIcon from "./src/components/icons/CalculatorIcon";
import PricesIcon from "./src/components/icons/PricesIcon";

export type CalculatorStackParamList = {
  Calculator: { prices: PriceMap };
  History: undefined;
  Receipt: { session: Session };
  Preview: { session: Session };
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<CalculatorStackParamList>();

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
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{ title: "Preview" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [prices, setPrices] = useState<PriceMap>(defaultPrices);

  useEffect(() => {
    const loadAndMergePrices = async () => {
      try {
        const storedJson = await AsyncStorage.getItem("prices");
        let finalPrices = { ...defaultPrices };
        if (storedJson) {
          const storedPrices = JSON.parse(storedJson) as Partial<PriceMap>;
          finalPrices = { ...finalPrices, ...storedPrices };
        }
        setPrices(finalPrices);
        await AsyncStorage.setItem("prices", JSON.stringify(finalPrices));
        // console.log("Final prices: ",JSON.stringify(finalPrices))
      } catch (error) {
        console.error("Failed to load or merge prices:", error);
        setPrices(defaultPrices);
      }
    };

    loadAndMergePrices();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#999",
        }}
      >
        <Tab.Screen
          name="CalculatorTab"
          options={{
            headerShown: false,
            title: "Calculator",
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <CalculatorIcon color={color} size={size} />
            ),
          }}
        >
          {() => <CalculatorStack prices={prices} />}
        </Tab.Screen>
        <Tab.Screen
          name="PricesTab"
          options={{
            title: "Prices",
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <PricesIcon color={color} size={size} />
            ),
          }}
        >
          {() => <PricesScreen prices={prices} setPrices={setPrices} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
