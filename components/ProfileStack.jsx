import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import UserScreen from '../screens/settings/UserScreen';
import AdressScreen from '../screens/settings/AdressScreen';
import VehicleScreen from '../screens/settings/VehicleScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import LegalScreen from '../screens/settings/LegalScreen';
import UserProfileScreen from '../screens/settings/UserProfileScreen';
import LoginScreen from '../screens/Forms/LoginScreen';
import SignUpScreen from '../screens/Forms/SignUpScreen';
import EditVehicleScreen from '../screens/settings/EditVehicleScreen';
import EditAdressScreen from '../screens/settings/EditAdressScreen';
import AddBusinessScreen from '../screens/settings/AddBusinessScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
 return (
   <Stack.Navigator>
     <Stack.Screen
       name="Profile"
       component={ProfileScreen}
       options={{ headerShown: false }}
     />
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
      name="LoginScreen" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
       name="SignUpScreen" 
       component={SignUpScreen} 
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
   </Stack.Navigator>
 );
};

export default ProfileStack;