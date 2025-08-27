# CardPurchase 📱

A simple React Native (Expo) app to help calculate and manage card purchases for **Glo, Airtel, and MTN**.  
Built with **TypeScript**, **Expo**, and **React Navigation**.

---

## ✨ Features

- Two main tabs:

  1. **Calculator Tab**

     - Select card type (Glo, Airtel, MTN).
     - Choose denomination (₦100, ₦200, ₦500, ₦1000).
     - Enter quantity (supports fractions like `1/2` or mixed like `2 1/2`).
     - Calculates subtotal per line item.
     - Displays **overall total** (moved to the top for visibility).
     - Supports large number formatting (`200000` → `200,000`).

  2. **Prices Tab**
     - Update purchase prices for each denomination.
     - Prices persist via **AsyncStorage** (local storage).

- Minimal and clean design.
- Fraction parsing handled by utility function.
- Auto scrolls when typing into inputs (using `KeyboardAvoidingView`).

---

## 📂 Project Structure

CardPurchase/
├── src/
│ ├── components/ # Reusable UI components
│ ├── screens/ # Calculator.tsx, Prices.tsx
│ ├── utils/ # Utility functions
│ │ ├── fractions.ts # parseFraction()
│ │ └── format.ts # formatNumber()
│ └── App.tsx # Entry point
├── babel.config.js
├── package.json
├── tsconfig.json
└── README.md

---

## ⚙️ Setup Guide (Ubuntu + Yarn)

1. **Install Expo CLI (recommended via npx):**
   ```bash
    yarn global add expo-cli
    yarn add @react-navigation/native @react-navigation/bottom-tabs
    yarn add @react-native-async-storage/async-storage
    expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
    yarn add -D @types/react @types/react-native
   ```
