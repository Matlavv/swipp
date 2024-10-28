import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailledRefuelReservation from "../components/History/DetailledRefuelReservation"; // Importer le composant pour afficher les détails d'une réservation de ravitaillement
import DetailledRepairReservation from "../components/History/DetailledRepairReservation"; // Importer le composant pour afficher les détails d'une réservation de réparation
import HistoryScreen from "../screens/HistoryScreen"; // Importer l'écran historique principal

// Création de la pile de navigation pour l'historique des réservations
const Stack = createNativeStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator>
      {/* Écran principal de l'historique */}
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: false }} // Masquer l'en-tête pour cet écran
      />
      {/* Écran des détails pour une réservation de réparation */}
      <Stack.Screen
        name="DetailledRepairReservation"
        component={DetailledRepairReservation}
        options={{ headerShown: false }} // Masquer l'en-tête pour cet écran
      />
      {/* Écran des détails pour une réservation de ravitaillement */}
      <Stack.Screen
        name="DetailledRefuelReservation"
        component={DetailledRefuelReservation}
        options={{ headerShown: false }} // Masquer l'en-tête pour cet écran
      />
    </Stack.Navigator>
  );
};

export default HistoryStack;
