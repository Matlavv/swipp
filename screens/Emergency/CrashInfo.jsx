import { Ionicons } from "@expo/vector-icons"; // Importation des icônes Ionicons pour les boutons
import { useNavigation } from "@react-navigation/native"; // Hook pour gérer la navigation
import React from "react"; // Importation de React
import {
  Image, // Composant pour afficher des images
  Linking, // Permet d'ouvrir des liens ou d'interagir avec des URL (pour les appels)
  Platform, // Utilisé pour détecter le système d'exploitation (iOS/Android)
  ScrollView, // Composant pour permettre le défilement du contenu
  Text, // Composant pour afficher du texte
  TouchableOpacity, // Composant pour créer des boutons cliquables
  View, // Conteneur pour organiser les éléments
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView pour éviter le chevauchement avec la barre de statut
import tw from "twrnc"; // Utilisation de la bibliothèque Tailwind CSS pour styliser les composants
import { swippLogo } from "../../assets"; // Importation du logo de l'application

// Composant principal pour afficher les informations d'accident
const CrashInfo = () => {
  const navigation = useNavigation(); // Hook pour gérer la navigation

  // Liste des numéros d'urgence (incluant les assurances)
  const emergencyNumbers = [
    { name: "Police Secours", number: "17" },
    { name: "Pompiers", number: "18" },
    { name: "SAMU", number: "15" },
    { name: "Numéro d'urgence européen", number: "112" },
    { name: "Allianz", number: "0 978 978 000" },
    // (Autres numéros d'assurance listés ici...)
  ];

  // Fonction pour initier un appel téléphonique
  const makeCall = (number) => {
    console.log(`Tentative d'appel du numéro: ${number}`);
    const phoneNumber =
      Platform.OS === "android" ? `tel:${number}` : `telprompt:${number}`; // Définit le format de l'URL en fonction du système d'exploitation
    console.log(`Ouverture de l'URL: ${phoneNumber}`);
    // Vérifie si le numéro peut être ouvert comme un lien
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          console.log("Numéro non supporté");
        } else {
          return Linking.openURL(phoneNumber); // Ouvre l'application téléphone pour passer l'appel
        }
      })
      .catch((err) => console.log(err)); // Gestion des erreurs
  };

  return (
    <SafeAreaView style={tw`flex h-full`}> {/* SafeAreaView pour protéger le contenu des zones à risque comme la barre de statut */}
      <ScrollView style={tw`flex-1`}>
        {/* Affichage du logo de l'application */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>

        {/* Bouton de retour et titre de la page */}
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()} // Retour à la page précédente
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Indiquer un accident</Text>
        </View>

        {/* Affichage des numéros d'urgence */}
        <Text style={tw`text-xl font-bold m-5`}>Numéros d'urgence :</Text>
        {/* Boucle sur la liste des numéros d'urgence pour les afficher */}
        {emergencyNumbers.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => makeCall(item.number)} // Appelle la fonction `makeCall` pour initier un appel
            style={tw`mb-3 ml-3`}
          >
            <View style={tw`flex-row`}>
              {/* Affichage du nom du service et du numéro */}
              <Text style={tw`text-lg`}>{item.name} : </Text>
              <Text style={tw`font-bold text-lg`}>{item.number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CrashInfo; // Exportation du composant
