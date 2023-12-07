import React from 'react';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RefuelHistory from '../components/History/RefuelHistory';
import RepairHistory from '../components/History/RepairHistory';

const Tab = createMaterialTopTabNavigator();

const HistoryScreen = () => {
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
      component={RefuelHistory}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="local-gas-station" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Réparation"
      component={RepairHistory}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon name="car-repair" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
 );
};

export default HistoryScreen;
