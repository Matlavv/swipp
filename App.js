import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Keyboard, Text } from "react-native";
import tw from "twrnc";
import ProfileStack from "./components/ProfileStack";
import ServicesStack from "./components/ServicesStack";
import EmergencyScreen from "./screens/EmergencyScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
// import { home } from ".icons";

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F5F5F5",
  },
};
const CustomTabLabel = ({ route, focused }) => {
  const labelText = route?.name;

  return focused ? <Text>{labelText}</Text> : null;
};


const App = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
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
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route?.name === "Accueil") {
              iconName = focused ? "home" : "home-outline";
            } else if (route?.name === "Services") {
              iconName = focused ? "apps" : "apps-outline";
            } else if (route?.name === "Urgence") {
              iconName = focused ? "warning" : "warning-outline";
            } else if (route?.name === "Historique") {
              iconName = focused ? "time" : "time-outline";
            } else if (route?.name === "Profil") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Ionicons name={iconName} size={25} color={color} />;
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#5E80BF",
          tabBarActiveBackgroundColor: "#34469C",
          tabBarInactiveBackgroundColor: "#34469C",
          headerShown: false,
          tabBarStyle: {
            ...(!keyboardVisible && {
              display: "flex",
              height: 70, // Adjust the height of the tab bar
              paddingBottom: 0, // Adjust the padding bottom of the tab bar
              paddingTop: 0, // Adjust the padding top of the tab bar
            }),
            ...tw`bg-white`,
          },
          tabBarLabel: ({ focused, route }) => (
            <CustomTabLabel route={route} focused={focused} />
          ),
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Services" component={ServicesStack} />
        <Tab.Screen name="Urgence" component={EmergencyScreen} />
        <Tab.Screen name="Historique" component={HistoryScreen} />
        <Tab.Screen name="Profil" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;