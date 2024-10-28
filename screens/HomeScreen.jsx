import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { AuthContext } from "../AuthContext"; // Contexte d'authentification pour gérer l'utilisateur courant
import { profilePic, swippLogo } from "../assets"; // Import des images (logo et photo de profil par défaut)
import DisplayAdress from "../components/DisplayAdress"; // Composant pour afficher l'adresse utilisateur
import NavOptions from "../components/NavOptions"; // Composant pour afficher les options de navigation
import SuggestedList from "../components/SuggestedList"; // Composant pour afficher les suggestions
import { auth, db } from "../firebaseConfig"; // Firebase pour la gestion des utilisateurs et des données

const HomeScreen = () => {
  const [username, setUsername] = useState(""); // État pour stocker le nom d'utilisateur
  const [profileImage, setProfileImage] = useState(""); // État pour stocker l'image de profil
  const navigation = useNavigation(); // Hook pour naviguer entre les écrans
  const { currentUser } = useContext(AuthContext); // Contexte d'authentification pour récupérer l'utilisateur actuel

  // Fonction pour récupérer les données de l'utilisateur depuis Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Récupérer l'utilisateur connecté
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid); // Référence au document utilisateur dans Firestore
          const docSnap = await getDoc(docRef); // Récupérer les données de l'utilisateur
          if (docSnap.exists()) {
            setUsername(docSnap.data().username); // Mettre à jour le nom d'utilisateur dans l'état
            const profileImageUrl =
              docSnap.data().profileImageUrl || profilePic; // Utiliser l'image de profil de l'utilisateur ou une image par défaut
            setProfileImage(profileImageUrl); // Mettre à jour l'image de profil dans l'état
          } else {
            console.log("Document utilisateur introuvable");
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données utilisateur",
            error
          );
        }
      }
    };
    fetchUserData(); // Appel de la fonction pour récupérer les données de l'utilisateur
  }, [currentUser]);

  // Mettre à jour le nom d'utilisateur si l'utilisateur actuel change
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.displayName);
    } else {
      setUsername("");
    }
  }, [currentUser]);

  // Navigation vers l'écran des services
  const navigateToServiceScreen = () => {
    navigation.navigate("Services");
  };

  // Navigation vers l'écran du profil utilisateur
  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* Logo */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>

        {/* Message de bienvenue */}
        <Text style={tw`text-2xl font-bold m-5`}>
          Bonjour {username || "!"} 👋
        </Text>

        {/* Options de navigation */}
        <View style={tw`flex`}>
          <NavOptions />
        </View>

        {/* Section des suggestions */}
        <View style={tw`flex flex-row justify-between items-center p-2 mt-5`}>
          <Text style={tw`text-2xl font-semibold`}>Populaire</Text>
          <TouchableOpacity onPress={navigateToServiceScreen}>
            <Text style={tw`font-light`}>Tout afficher</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des suggestions */}
        <SuggestedList />

        {/* Section des adresses */}
        <View style={tw`flex mt-5 p-2`}>
          <Text style={tw`text-2xl font-semibold`}>
            Faites vous livrer votre plein
          </Text>
          <DisplayAdress currentUser={currentUser} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
