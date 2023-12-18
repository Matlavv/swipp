import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import tw from 'twrnc';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ServiceScreen from './screens/ServiceScreen';
import ProfileStack from './components/ProfileStack'; 
import { Keyboard } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      ...tw`shadow-lg`, // Add shadow (if needed)
    }}
    onPress={onPress}
  >
    <View style={{
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#B9D9EB', // Customize your button color
    }}>
      {children}
    </View>
  </TouchableOpacity>
);

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
         tabBarStyle: {
           ...(!keyboardVisible && {
             display: 'flex',
             height: 50, // Adjust the height of tab bar
             paddingBottom: 0, // Adjust the padding bottom of tab bar
             paddingTop: 0, // Adjust the padding top of tab bar
           }),
           ...tw`bg-white`, 
         },
         tabBarShowLabel: true, // Set this to false to hide the label
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
         name="Urgence"
         component={ServiceScreen}
         options={{
           tabBarIcon: ({ focused }) => (
             <Ionicons
               name="warning"
               size={30}
               color={focused ? 'white' : 'grey'}
             />
           ),
           tabBarButton: (props) => (
             <CustomTabBarButton {...props} />
           ),
           tabBarLabel: () => null,
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