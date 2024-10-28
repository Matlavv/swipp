import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AboutScreen from "../screens/settings/AboutScreen";
import AddBusinessScreen from "../screens/settings/Forms/AddBusinessScreen";
import AdressScreen from "../screens/settings/Forms/AdressScreen";
import EditAdressScreen from "../screens/settings/Forms/UpdateForms/EditAdressScreen";
import EditVehicleScreen from "../screens/settings/Forms/UpdateForms/EditVehicleScreen";
import LegalScreen from "../screens/settings/LegalScreen";
import AdminRefuelReservationDetailled from "../screens/settings/RefuelAdmin/AdminRefuelReservationDetailled";
import RefuelAdmin from "../screens/settings/RefuelAdmin/RefuelAdmin";
import UserProfileScreen from "../screens/settings/UserProfileScreen";
import UserScreen from "../screens/settings/UserScreen";
import VehicleScreen from "../screens/settings/VehicleScreen";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import RefuelInfos from "../screens/settings/RefuelAdmin/RefuelInfos";

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  // Contexte d'authentification pour vérifier si l'utilisateur est connecté
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {/* Si l'utilisateur n'est pas authentifié, afficher les écrans de connexion et d'inscription */}
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }} // Masquer l'en-tête
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ headerShown: false }} // Masquer l'en-tête
          />
        </>
      ) : (
        <>
          {/* Si l'utilisateur est authentifié, afficher les différents écrans de profil et de gestion */}
          <Stack.Screen
            name="UserScreen"
            component={UserScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserProfileScreen"
            component={UserProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdressScreen"
            component={AdressScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VehicleScreen"
            component={VehicleScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LegalScreen"
            component={LegalScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AboutScreen"
            component={AboutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RefuelAdmin"
            component={RefuelAdmin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RefuelInfos"
            component={RefuelInfos}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditVehicleScreen"
            component={EditVehicleScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditAdressScreen"
            component={EditAdressScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddBusinessScreen"
            component={AddBusinessScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminRefuelReservationDetailled"
            component={AdminRefuelReservationDetailled}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ProfileStack;
