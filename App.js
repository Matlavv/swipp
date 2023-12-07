import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import tw from 'twrnc';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ServiceScreen from './screens/ServiceScreen';
import ProfileStack from './components/ProfileStack'; 
import { Keyboard } from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

 useEffect(() => {
   const keyboardDidShowListener = Keyboard.addListener(
     'keyboardDidShow',
     () => {
       setKeyboardVisible(true);
     }
   );
   const keyboardDidHideListener = Keyboard.addListener(
     'keyboardDidHide',
     () => {
       setKeyboardVisible(false);
     }
   );

   return () => {
     keyboardDidHideListener.remove();
     keyboardDidShowListener.remove();
   };
 }, []);
 return (
   <NavigationContainer>
     <Tab.Navigator
       screenOptions={{
         tabBarActiveTintColor: 'black',
         tabBarInactiveTintColor: 'gray',
         headerShown: false,
         tabBarStyle: keyboardVisible ? { display: 'none' } : {}
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