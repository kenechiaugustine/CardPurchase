import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalculatorScreen from "./src/screens/CalculatorScreen";
import PricesScreen from "./src/screens/PricesScreen";
import { defaultPrices } from "./src/constants";
import { PriceMap } from "./src/types";

const Tab = createBottomTabNavigator();

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
        <Tab.Screen name="Calculator">
          {() => <CalculatorScreen prices={prices} />}
        </Tab.Screen>
        <Tab.Screen name="Prices">
          {() => <PricesScreen prices={prices} setPrices={setPrices} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
