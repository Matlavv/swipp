// Importation des dépendances nécessaires
import { Ionicons } from "@expo/vector-icons"; // Icônes Ionicons
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Fonctions Firestore pour récupérer et mettre à jour des documents
import React, { useEffect, useState } from "react"; // Hooks React pour la gestion des états et des effets
import {
  Alert, // Affichage des alertes
  Image, // Composant pour afficher des images
  SafeAreaView, // Composant pour gérer les zones sûres sur les appareils
  ScrollView, // Composant pour la vue défilable
  Text, // Composant texte
  TextInput, // Composant pour les champs de texte
  TouchableOpacity, // Composant pour les boutons cliquables
  View, // Conteneur de vues
} from "react-native"; // Composants React Native
import tw from "twrnc"; // Utilisation de Tailwind CSS pour le style
import { swippLogo } from "../../../../assets"; // Logo de l'application
import { auth, db } from "../../../../firebaseConfig"; // Configuration Firebase pour l'authentification et Firestore

// Définition du composant pour modifier une adresse
const EditAdressScreen = ({ route, navigation }) => {
  // Récupération de l'ID de l'adresse passée en paramètre via la navigation
  const { adressId } = route.params;
  // Déclaration des états locaux pour gérer les informations de l'adresse
  const [adresse, setAdresse] = useState(""); // Adresse
  const [pays, setPays] = useState(""); // Pays
  const [ville, setVille] = useState(""); // Ville
  const [codePostal, setCodePostal] = useState(""); // Code postal
  const [label, setLabel] = useState(""); // Label (ex : Domicile, Travail)

  // Chargement des données de l'adresse à partir de Firestore à l'ouverture de l'écran
  useEffect(() => {
    const fetchAdressData = async () => {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid, // Récupération de l'ID de l'utilisateur connecté
        "adresses",
        adressId // ID de l'adresse à modifier
      );
      const docSnap = await getDoc(docRef); // Récupération du document
      if (docSnap.exists()) {
        const adressData = docSnap.data(); // Récupération des données de l'adresse
        // Mise à jour des états locaux avec les données récupérées
        setAdresse(adressData.adresse);
        setPays(adressData.pays);
        setVille(adressData.ville);
        setCodePostal(adressData.codePostal);
        setLabel(adressData.label);
      }
    };
    fetchAdressData(); // Appel de la fonction pour charger les données de l'adresse
  }, [adressId]); // Exécution de l'effet à chaque changement de l'ID de l'adresse

  // Fonction pour gérer la mise à jour de l'adresse
  const handleUpdateAdress = async () => {
    try {
      // Vérification que tous les champs sont remplis
      if (!adresse || !pays || !ville || !codePostal || !label) {
        Alert.alert("Erreur", "Tous les champs doivent être remplis");
        return; // Arrêt de la fonction si un champ est vide
      } else {
        // Mise à jour de l'adresse dans Firestore
        await updateDoc(
          doc(db, "users", auth.currentUser.uid, "adresses", adressId), // Chemin du document à mettre à jour
          {
            adresse, // Nouvelle adresse
            pays, // Nouveau pays
            ville, // Nouvelle ville
            codePostal, // Nouveau code postal
            label, // Nouveau label
          }
        );
        // Affichage d'une alerte de confirmation
        Alert.alert("Adresse mise à jour !");
        navigation.goBack(); // Retour à l'écran précédent
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse", error); // Gestion des erreurs
    }
  };

  // Rendu du composant
  return (
    <SafeAreaView style={tw`flex-1 mt-5`}>
      <ScrollView>
        {/* Affichage du logo de l'application */}
        <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
          <Image style={tw`w-60 h-30`} source={swippLogo} />
        </View>
        {/* Retour à l'écran précédent et titre de l'écran */}
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()} // Retour à l'écran précédent
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Modifier une adresse</Text>
        </View>
        {/* Formulaire de modification de l'adresse */}
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`} // Style du champ de texte
            placeholder="Adresse" // Placeholder
            value={adresse} // Valeur de l'adresse
            onChangeText={setAdresse} // Mise à jour de l'état
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Pays"
            value={pays}
            onChangeText={setPays}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Ville"
            value={ville}
            onChangeText={setVille}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Code Postal"
            keyboardType="numeric" // Clavier numérique
            value={codePostal}
            onChangeText={setCodePostal}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Label, ex : Domicile/Travail"
            value={label}
            onChangeText={setLabel}
          />
          {/* Bouton pour soumettre les modifications */}
          <TouchableOpacity
            onPress={handleUpdateAdress} // Appel de la fonction de mise à jour
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex w-3/4`}
          >
            <Text style={tw`text-white text-sm`}>Mettre à jour l'adresse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Export du composant
export default EditAdressScreen;
