import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChooseGarageModal from "../components/Modal/ChooseGarageModal";
import DateTimePickerModal from "../components/Modal/DateTimePickerModal";
import MaintenanceForm from "../screens/Forms/MaintenanceForm";
import RefuelForm from "../screens/Forms/RefuelForm";
import RepairForm from "../screens/Forms/RepairForm";
import TechnicalControlForm from "../screens/Forms/TechnicalControlForm";
import HomeScreen from "../screens/HomeScreen";

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
