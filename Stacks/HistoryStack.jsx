import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailledRefuelReservation from "../components/History/DetailledRefuelReservation";
import DetailledRepairReservation from "../components/History/DetailledRepairReservation";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailledRepairReservation"
        component={DetailledRepairReservation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailledRefuelReservation"
        component={DetailledRefuelReservation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HistoryStack;
