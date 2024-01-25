import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import RefuelForm from "../components/Forms/RefuelForm";
import RepairForm from "../components/Forms/RepairForm";
import EmergencyScreen from "../screens/EmergencyScreen";
import ServiceScreen from "../screens/ServiceScreen";
import ChooseGarageForm from "./Forms/ChooseGarageForm";
import DateTimePickerModal from "./Forms/DateTimePickerModal";
import MaintenanceForm from "./Forms/MaintenanceForm";
import TechnicalControlForm from "./Forms/TechnicalControlForm";

const Stack = createNativeStackNavigator();

const ServicesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Service"
        component={ServiceScreen}
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
        name="ChooseGarageForm"
        component={ChooseGarageForm}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ServicesStack;
