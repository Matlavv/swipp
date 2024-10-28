import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native"; // Intégration avec Stripe
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen"; // Gestion de l'écran de chargement au démarrage
import { onAuthStateChanged } from "firebase/auth"; // Suivi de l'état d'authentification avec Firebase
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, StatusBar, Text, View } from "react-native";
import tw from "twrnc"; // Utilisation de Tailwind CSS pour React Native
import { AuthProvider } from "./AuthContext"; // Fournisseur de contexte pour la gestion de l'authentification
import { auth } from "./firebaseConfig"; // Configuration de Firebase
import EmergencyStack from "./Stacks/EmergencyStack"; // Stack pour la navigation des urgences
import HistoryStack from "./Stacks/HistoryStack"; // Stack pour la navigation de l'historique
import HomeStack from "./Stacks/HomeStack"; // Stack pour la navigation de l'accueil
import ProfileStack from "./Stacks/ProfileStack"; // Stack pour la navigation du profil
import ServicesStack from "./Stacks/ServicesStack"; // Stack pour la navigation des services
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; // Gestion des zones sûres sur iOS et Android

const Tab = createBottomTabNavigator(); // Création du gestionnaire de navigation par onglets

// Thème personnalisé pour l'application
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F5F5F5", // Couleur de fond personnalisée
  },
};

// Composant personnalisé pour l'étiquette des onglets
const CustomTabLabel = ({ route, focused }) => {
  const labelText = route?.name; // Nom de la route
  const labelStyle = focused ? tw`text-white` : tw`text-gray-400`; // Style selon l'état activé ou désactivé

  return focused ? (
    <Text style={[tw`text-white`, tw`mb-2`]}>{labelText}</Text>
  ) : null; // Affiche l'étiquette seulement si l'onglet est sélectionné
};

const App = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false); // Suivi de l'état du clavier
  const [currentUser, setCurrentUser] = useState(null); // Suivi de l'utilisateur connecté
  const [appIsReady, setAppIsReady] = useState(false); // Suivi de l'état de préparation de l'application

  StatusBar.setBackgroundColor(MyTheme.colors.background); // Définir la couleur de la barre de statut

  // Gestion des événements liés au clavier (montrer/cacher)
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

  // Suivi de l'état de l'utilisateur connecté via Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // Utilisateur connecté
      } else {
        setCurrentUser(null); // Utilisateur déconnecté
      }
    });

    return () => unsubscribe();
  }, []);

  // Chargement des ressources nécessaires avant d'afficher l'application
  const prepareResources = async () => {
    try {
      await SplashScreen.preventAutoHideAsync(); // Prévenir la fermeture automatique de l'écran de démarrage
      await Font.loadAsync(Ionicons.font); // Charger les polices d'Ionicons
    } catch (e) {
      console.warn(e); // Gérer les erreurs
    } finally {
      setAppIsReady(true); // Application prête
    }
  };

  useEffect(() => {
    prepareResources(); // Charger les ressources au démarrage
  }, []);

  // Cacher l'écran de démarrage lorsque l'application est prête
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Rendre null tant que l'application n'est pas prête
  }

  return (
    // Fournisseur de Stripe pour gérer les paiements
    <StripeProvider publishableKey="pk_test_51Ojf5bF83Tq1HuHRfQwEjkl2ijtjlSglPzZwOWwQEFwdg241DJOWKGoyyTaQsWjbM4Ty1Q1ZDCsm8x9ktyuscR6j008onZDmQm">
      <AuthProvider> {/* Contexte d'authentification pour l'application */}
        <NavigationContainer theme={MyTheme}> {/* Conteneur de navigation avec un thème personnalisé */}
        <SafeAreaProvider>
          <SafeAreaView  onLayout={onLayoutRootView} style={{ flex: 1 }}> {/* Gestion de la zone sûre sur iOS et Android */}
            <Tab.Navigator
              screenOptions={({ route }) => ({
                // Définition des icônes et du style des onglets
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
                  return <Ionicons name={iconName} size={25} color={color} />; // Icone d'onglet
                },
                tabBarActiveTintColor: "white", // Couleur de l'icône activée
                tabBarInactiveTintColor: "#5E80BF", // Couleur de l'icône désactivée
                tabBarActiveBackgroundColor: "#34469C", // Couleur de fond activée
                tabBarInactiveBackgroundColor: "#34469C", // Couleur de fond désactivée
                headerShown: false, // Masquer l'en-tête par défaut
                tabBarStyle: {
                  // Styles personnalisés pour la barre d'onglets
                  ...(!keyboardVisible && {
                    display: "flex", // Afficher la barre d'onglets
                    height: 70,
                    paddingBottom: 0,
                    paddingTop: 0,
                  }),
                  ...tw`bg-white`, // Style Tailwind CSS pour la couleur de fond
                },
                tabBarLabel: ({ focused }) => (
                  <CustomTabLabel route={route} focused={focused} /> // Etiquette personnalisée
                ),
              })}
            >
              {/* Onglet Accueil */}
              <Tab.Screen name="Accueil">
                {() => <HomeStack currentUser={currentUser} />}
              </Tab.Screen>

              {/* Onglet Services */}
              <Tab.Screen name="Services" component={ServicesStack} />
              {/* Onglet Urgence */}
              <Tab.Screen name="Urgence" component={EmergencyStack} />
              {/* Onglet Historique */}
              <Tab.Screen name="Historique" component={HistoryStack} />
              {/* Onglet Profil */}
              <Tab.Screen name="Profil" component={ProfileStack} />
            </Tab.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
};

export default App;
