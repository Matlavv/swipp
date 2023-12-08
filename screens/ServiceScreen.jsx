import React from 'react';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RefuelReservationForm from '../components/Services/RefuelReservationForm';
import RepairReservationForm from '../components/Services/RepairReservationForm';

const Tab = createMaterialTopTabNavigator();

const ServiceScreen = () => {
 return (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'grey',
      tabBarStyle: { backgroundColor: 'white' },
      tabBarIndicatorStyle: { backgroundColor: 'black', height: 3 },
    }}
    style={tw`pt-8`}
  >
    <Tab.Screen
      name="Refuel"
      component={RefuelReservationForm}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="local-gas-station" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Réparation"
      component={RepairReservationForm}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="car-repair" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
 );
};

export default ServiceScreen;
