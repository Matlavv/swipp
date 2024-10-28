import { Ionicons } from "@expo/vector-icons"; // Importation des icônes Ionicons pour les boutons
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Hooks pour gérer la navigation et la mise au focus de l'écran
import {
  addDoc, // Fonction pour ajouter un document à Firestore
  collection, // Fonction pour accéder à une collection dans Firestore
  deleteDoc, // Fonction pour supprimer un document dans Firestore
  doc, // Fonction pour accéder à un document spécifique dans Firestore
  getDocs, // Fonction pour récupérer les documents d'une collection
} from "firebase/firestore"; // Importation des fonctionnalités Firestore
import React, { useState } from "react"; // Importation de React et du hook useState pour la gestion des états
import {
  Alert, // Pour afficher des alertes natives
  Image, // Composant pour afficher des images
  SafeAreaView, // Composant pour délimiter une zone de l'écran
  ScrollView, // Composant pour ajouter la fonctionnalité de défilement
  Text, // Composant pour afficher du texte
  TextInput, // Composant pour les champs de saisie
  TouchableOpacity, // Composant pour créer des boutons cliquables
  View, // Conteneur pour structurer les composants
} from "react-native";
import tw from "twrnc"; // Utilisation de la librairie Tailwind pour styliser les composants
import { swippLogo } from "../../../assets"; // Importation du logo de l'application
import { auth, db } from "../../../firebaseConfig"; // Importation de l'authentification et de la base de données Firestore

// Composant principal pour la gestion des adresses
const AdressScreen = () => {
  // États pour gérer les différentes données des adresses
  const [adresse, setAdresse] = useState("");
  const [adresses, setAdresses] = useState([]); // Liste des adresses
  const [pays, setPays] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [label, setLabel] = useState("");

  const navigation = useNavigation(); // Hook pour la navigation

  // Fonction pour charger les adresses de l'utilisateur depuis Firestore
  const loadAdresses = async () => {
    const user = auth.currentUser; // Obtenir l'utilisateur connecté
    if (user) {
      // Récupérer les adresses de l'utilisateur depuis Firestore
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "adresses")
      );
      // Transformer les documents en une liste d'adresses avec leur ID
      const userAdresses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdresses(userAdresses); // Mettre à jour l'état avec les adresses récupérées
    }
  };

  // Utilisation de useFocusEffect pour recharger les adresses chaque fois que l'écran est mis en avant
  useFocusEffect(
    React.useCallback(() => {
      loadAdresses(); // Recharger les adresses à chaque mise au focus de l'écran
    }, [])
  );

  // Fonction pour naviguer vers l'écran d'édition d'une adresse spécifique
  const navigateToEditAdress = (adressId) => {
    navigation.navigate("EditAdressScreen", {
      adressId, // Passer l'ID de l'adresse à éditer à l'écran suivant
    });
  };

  // Fonction pour sauvegarder une nouvelle adresse dans Firestore
  const handleSaveAddress = async () => {
    const user = auth.currentUser; // Obtenir l'utilisateur connecté
    if (user) {
      try {
        // Vérification que tous les champs sont remplis
        if (!adresse || !pays || !ville || !codePostal || !label) {
          Alert.alert("Erreur", "Tous les champs doivent être remplis");
          return;
        } else {
          // Ajout de l'adresse à Firestore
          await addDoc(collection(db, "users", user.uid, "adresses"), {
            adresse,
            pays,
            ville,
            codePostal,
            label,
          });
          // Réinitialiser les champs du formulaire après l'ajout
          setAdresse('');
          setPays('');
          setVille('');
          setCodePostal('');
          setLabel('');
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'adresse", error); // Afficher l'erreur dans la console en cas de problème
      }
    }
    loadAdresses(); // Recharger la liste des adresses après l'ajout
  };

  // Fonction pour supprimer une adresse depuis Firestore
  const deleteAdress = async (adressId) => {
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "adresses", adressId) // Supprimer l'adresse avec l'ID spécifique
      );
      Alert.alert("Adresse supprimée !");
      loadAdresses(); // Recharger la liste des adresses après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de l'adresse", error); // Afficher l'erreur dans la console en cas de problème
    }
    loadAdresses(); // Recharger les adresses après suppression
  };

  return (
    <SafeAreaView style={tw`flex-1 mt-5`}> {/* Zone sécurisée pour éviter le recouvrement par les barres de navigation */}
      <ScrollView>
        {/* Affichage du logo de l'application */}
        <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
          <Image style={tw`w-60 h-30`} source={swippLogo} />
        </View>

        {/* Titre et bouton de retour */}
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()} // Retour à la page précédente
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Ajouter une adresse</Text>
        </View>

        {/* Liste des adresses enregistrées */}
        {adresses.map((adresse, index) => (
          <View key={index} style={tw`mx-4 mt-4`}>
            <TouchableOpacity
              onPress={() => navigateToEditAdress(adresse.id)} // Naviguer vers l'écran d'édition d'adresse
              style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg`}
            >
              <View style={tw`flex-1`}>
                {/* Affichage des informations de l'adresse */}
                <Text style={tw`text-2xl font-bold text-black`}>
                  {adresse.label}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {adresse.adresse}, {adresse.ville}, {adresse.pays}
                </Text>
              </View>
              {/* Bouton pour supprimer une adresse */}
              <TouchableOpacity onPress={() => deleteAdress(adresse.id)}>
                <Ionicons name="trash" size={24} color="gray" />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={tw`bg-gray-200 h-0.2 w-full mt-2`} />
          </View>
        ))}

        {/* Formulaire pour ajouter une nouvelle adresse */}
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Adresse, ex: 123 rue de la Paix"
            value={adresse}
            onChangeText={setAdresse}
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
            keyboardType="numeric"
            value={codePostal}
            onChangeText={setCodePostal}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Label, ex : Domicile/Travail"
            value={label}
            onChangeText={setLabel}
          />

          {/* Bouton pour enregistrer l'adresse */}
          <TouchableOpacity
            onPress={handleSaveAddress}
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Enregistrer mon adresse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdressScreen;
