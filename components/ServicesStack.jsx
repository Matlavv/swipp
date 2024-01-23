import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ServiceScreen from '../screens/ServiceScreen';
import AppointmentDateForm from './Forms/AppointmentDateForm';
import RefuelForm from '../components/Forms/RefuelForm';
import RepairForm from '../components/Forms/RepairForm';
import EmergencyScreen from '../screens/EmergencyScreen';
import MaintenanceForm from './Forms/MaintenanceForm';

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
            name="AppointmentDateForm" 
            component={AppointmentDateForm} 
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
    </Stack.Navigator>
  )
}

export default ServicesStack