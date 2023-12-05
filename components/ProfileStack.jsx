import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import UserScreen from '../screens/settings/UserScreen';
import AdressScreen from '../screens/settings/AdressScreen';
import CarScreen from '../screens/settings/CarScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import LegalScreen from '../screens/settings/LegalScreen';

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
       name="AdressScreen"
       component={AdressScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="CarScreen"
       component={CarScreen}
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
   </Stack.Navigator>
 );
};

export default ProfileStack;