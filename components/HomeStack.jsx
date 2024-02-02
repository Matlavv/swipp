import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import RefuelForm from "../components/Forms/RefuelForm";
import RepairForm from "../components/Forms/RepairForm";
import EmergencyScreen from "../screens/EmergencyScreen";
import HomeScreen from "../screens/HomeScreen";
import ChooseGarageModal from "./Forms/ChooseGarageModal";
import DateTimePickerModal from "./Forms/DateTimePickerModal";
import MaintenanceForm from "./Forms/MaintenanceForm";
import TechnicalControlForm from "./Forms/TechnicalControlForm";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DateTimePickerModal"
        component={DateTimePickerModal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RefuelForm"
        component={RefuelForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RepairForm"
        component={RepairForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmergencyScreen"
        component={EmergencyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MaintenanceForm"
        component={MaintenanceForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TechnicalControlForm"
        component={TechnicalControlForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChooseGarageModal"
        component={ChooseGarageModal}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
