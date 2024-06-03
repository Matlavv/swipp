import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { onAuthStateChanged } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, StatusBar, Text, View } from "react-native";
import tw from "twrnc";
import { AuthProvider } from "./AuthContext";
import EmergencyStack from "./components/EmergencyStack";
import HistoryStack from "./components/HistoryStack";
import HomeStack from "./components/HomeStack";
import ProfileStack from "./components/ProfileStack";
import ServicesStack from "./components/ServicesStack";
import { auth } from "./firebaseConfig";

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
  const labelStyle = focused ? tw`text-white` : tw`text-gray-400`;

  return focused ? (
    <Text style={[tw`text-white`, tw`mb-2`]}>{labelText}</Text>
  ) : null;
};

const App = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);

  StatusBar.setBackgroundColor(MyTheme.colors.background);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // L'utilisateur est connecté
        setCurrentUser(user);
      } else {
        // L'utilisateur est déconnecté
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const prepareResources = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync(Ionicons.font);
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  };

  useEffect(() => {
    prepareResources();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_51Ojf5bF83Tq1HuHRfQwEjkl2ijtjlSglPzZwOWwQEFwdg241DJOWKGoyyTaQsWjbM4Ty1Q1ZDCsm8x9ktyuscR6j008onZDmQm">
      <AuthProvider>
        <NavigationContainer theme={MyTheme}>
          <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
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
                tabBarLabel: ({ focused }) => (
                  <CustomTabLabel route={route} focused={focused} />
                ),
              })}
            >
              <Tab.Screen name="Accueil">
                {() => <HomeStack currentUser={currentUser} />}
              </Tab.Screen>

              <Tab.Screen name="Services" component={ServicesStack} />
              <Tab.Screen name="Urgence" component={EmergencyStack} />
              <Tab.Screen name="Historique" component={HistoryStack} />
              <Tab.Screen name="Profil" component={ProfileStack} />
            </Tab.Navigator>
          </View>
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
};

export default App;
