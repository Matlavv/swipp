import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ServiceScreen from './screens/ServiceScreen';
import ProfileStack from './components/ProfileStack'; 

const Tab = createBottomTabNavigator();

const App = () => {
 return (
   <NavigationContainer>
     <Tab.Navigator
       screenOptions={{
         tabBarActiveTintColor: 'black',
         tabBarInactiveTintColor: 'gray',
         headerShown: false,
       }}
     >
       <Tab.Screen
         name="Accueil"
         component={HomeScreen}
         options={{
           tabBarIcon: ({ color, size }) => (
             <Ionicons name="home" size={size} color={color} />
           ),
         }}
       />
       <Tab.Screen
         name="Services"
         component={ServiceScreen}
         options={{
           tabBarIcon: ({ color, size }) => (
             <Ionicons name="apps" size={size} color={color} />
           ),
         }}
       />
       <Tab.Screen
         name="Historique"
         component={HistoryScreen}
         options={{
           tabBarIcon: ({ color, size }) => (
             <Ionicons name="archive-outline" size={size} color={color} />
           ),
         }}
       />
       <Tab.Screen
         name="Profil"
         component={ProfileStack} 
         options={{
           tabBarIcon: ({ color, size }) => (
             <Ionicons name="person" size={size} color={color} />
           ),
         }}
       />
     </Tab.Navigator>
   </NavigationContainer>
 );
};

export default App;