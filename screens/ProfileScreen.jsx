import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import UserScreen from "./settings/UserScreen";

const ProfileScreen = () => {
  const [currentUser, setCurrentUser] = useState(null); // État pour stocker l'utilisateur courant
  const navigation = useNavigation(); // Hook pour la navigation

  useEffect(() => {
    // S'abonner aux changements d'état de l'utilisateur
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user); // Mettre à jour l'utilisateur courant
      if (!user) {
        navigation.navigate("LoginScreen"); // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      }
    });
    return unsubscribe; // Se désabonner lors du démontage du composant
  }, [navigation]);

  if (!currentUser) {
    // Rendre un écran de chargement ou null pendant que l'état d'authentification est vérifié
    return null; // Ici, vous pouvez remplacer null par un composant de chargement
  }

  // Si l'utilisateur est connecté, afficher le composant UserScreen
  return <UserScreen />;
};

export default ProfileScreen;
