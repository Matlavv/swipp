import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BreakdownInfo from "../screens/Emergency/BreakdownInfo";
import CrashInfo from "../screens/Emergency/CrashInfo";
import EmergencyScreen from "../screens/EmergencyScreen";

const Stack = createNativeStackNavigator();

const HistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EmergencyScreen"
        component={EmergencyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrashInfo"
        component={CrashInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BreakdownInfo"
        component={BreakdownInfo}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HistoryStack;
