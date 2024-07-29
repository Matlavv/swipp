import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChooseGarageModal from "../components/Forms/ChooseGarageModal";
import ChooseRepairDate from "../components/Forms/ChooseRepairDate";
import DateTimePickerModal from "../components/Forms/DateTimePickerModal";
import MaintenanceForm from "../components/Forms/MaintenanceForm";
import RefuelForm from "../components/Forms/RefuelForm";
import RepairForm from "../components/Forms/RepairForm";
import TechnicalControlForm from "../components/Forms/TechnicalControlForm";
import EmergencyScreen from "../screens/EmergencyScreen";
import ServiceScreen from "../screens/ServiceScreen";

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
        name="ChooseRepairDate"
        component={ChooseRepairDate}
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

export default ServicesStack;
