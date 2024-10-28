import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChooseGarageModal from "../components/Modal/ChooseGarageModal"; // Importer le modal de choix de garage
import DateTimePickerModal from "../components/Modal/DateTimePickerModal"; // Importer le modal de sélection de date et heure
import MaintenanceForm from "../screens/Forms/MaintenanceForm"; // Importer le formulaire pour la maintenance
import RefuelForm from "../screens/Forms/RefuelForm"; // Importer le formulaire pour la recharge de carburant
import RepairForm from "../screens/Forms/RepairForm"; // Importer le formulaire pour la réparation de véhicule
import TechnicalControlForm from "../screens/Forms/TechnicalControlForm"; // Importer le formulaire de contrôle technique
import HomeScreen from "../screens/HomeScreen"; // Importer l'écran d'accueil
import AdressScreen from "../screens/settings/Forms/AdressScreen"; // Importer l'écran pour gérer les adresses
import EditAdressScreen from "../screens/settings/Forms/UpdateForms/EditAdressScreen"; // Importer l'écran de modification d'adresse
import VehicleScreen from "../screens/settings/VehicleScreen"; // Importer l'écran pour gérer les véhicules
import EditVehicleScreen from "../screens/settings/Forms/UpdateForms/EditVehicleScreen"; // Importer l'écran de modification de véhicule

// Création de la pile de navigation
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      {/* Écran principal d'accueil */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }} // Masquer l'en-tête pour une meilleure expérience utilisateur
      />
      {/* Modal de sélection de date et heure */}
      <Stack.Screen
        name="DateTimePickerModal"
        component={DateTimePickerModal}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Formulaire de recharge de carburant */}
      <Stack.Screen
        name="RefuelForm"
        component={RefuelForm}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Formulaire de réparation */}
      <Stack.Screen
        name="RepairForm"
        component={RepairForm}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Formulaire de maintenance */}
      <Stack.Screen
        name="MaintenanceForm"
        component={MaintenanceForm}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Formulaire de contrôle technique */}
      <Stack.Screen
        name="TechnicalControlForm"
        component={TechnicalControlForm}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Modal de sélection de garage */}
      <Stack.Screen
        name="ChooseGarageModal"
        component={ChooseGarageModal}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Gestion des adresses */}
      <Stack.Screen
        name="AdressScreen"
        component={AdressScreen}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Écran de modification d'adresse */}
      <Stack.Screen
        name="EditAdressScreen"
        component={EditAdressScreen}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Gestion des véhicules */}
      <Stack.Screen
        name="VehicleScreen"
        component={VehicleScreen}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
      {/* Écran de modification de véhicule */}
      <Stack.Screen
        name="EditVehicleScreen"
        component={EditVehicleScreen}
        options={{ headerShown: false }} // Masquer l'en-tête
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
