# Project: CardPurchase

## Project Overview

This is a React Native (Expo) application designed to help users calculate and manage card purchases for various mobile networks (Glo, Airtel, MTN). The app is built with TypeScript, Expo, and React Navigation. It features a simple and clean user interface with two main tabs: a calculator for totaling purchases and a screen for managing the prices of different card denominations. Prices are persisted locally on the device using AsyncStorage.

## Building and Running

To get the application running, follow these steps:

1.  **Install Dependencies:**
    ```bash
    yarn install
    ```

2.  **Run the Application:**
    *   **For Android:**
        ```bash
        yarn android
        ```
    *   **For iOS:**
        ```bash
        yarn ios
        ```
    *   **For Web:**
        ```bash
        yarn web
        ```

3.  **Development Server:**
    To start the Expo development server, run:
    ```bash
    yarn dev
    ```

## Development Conventions

*   **Code Style:** The project follows standard TypeScript and React conventions. Code is organized into components, screens, and utility functions.
*   **State Management:** Component-level state is managed with React Hooks (`useState`, `useEffect`). App-level state, such as prices, is passed down as props from the main `App.tsx` component.
*   **Navigation:** Navigation is handled by React Navigation, with a combination of a bottom tab navigator and a stack navigator.
*   **Data Persistence:** Prices are persisted locally using `@react-native-async-storage/async-storage`.
*   **Type-Safety:** The project is written in TypeScript, and types are defined in `src/types.ts`.
