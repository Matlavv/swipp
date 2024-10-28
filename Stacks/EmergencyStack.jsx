import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BreakdownInfo from "../screens/Emergency/BreakdownInfo"; // Importer l'écran des informations sur la panne
import CrashInfo from "../screens/Emergency/CrashInfo"; // Importer l'écran des informations sur l'accident
import EmergencyScreen from "../screens/EmergencyScreen"; // Importer l'écran des services d'urgence

// Création d'une pile de navigation avec les écrans liés à l'urgence
const Stack = createNativeStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator>
      {/* Écran principal des services d'urgence */}
      <Stack.Screen
        name="EmergencyScreen"
        component={EmergencyScreen}
        options={{ headerShown: false }} // Masquer l'en-tête pour une expérience en plein écran
      />
      {/* Écran des informations sur les accidents */}
      <Stack.Screen
        name="CrashInfo"
        component={CrashInfo}
        options={{ headerShown: false }} // Masquer l'en-tête pour cet écran
      />
      {/* Écran des informations sur les pannes */}
      <Stack.Screen
        name="BreakdownInfo"
        component={BreakdownInfo}
        options={{ headerShown: false }} // Masquer l'en-tête pour cet écran
      />
    </Stack.Navigator>
  );
};

export default HistoryStack;
