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
import { SelectList } from "react-native-dropdown-select-list"; // Composant pour listes déroulantes
import { swippLogo } from "../../../../assets"; // Logo de l'application
import { auth, db } from "../../../../firebaseConfig"; // Configuration Firebase pour l'authentification et Firestore

// Définition du composant pour modifier un véhicule
const EditVehicleScreen = ({ route, navigation }) => {
  // Récupération de l'ID du véhicule passé en paramètre via la navigation
  const { vehicleId } = route.params;
  // Déclaration des états locaux pour gérer les informations du véhicule
  const [label, setLabel] = useState(""); // Label du véhicule
  const [type, setType] = useState(""); // Type du véhicule (voiture, moto...)
  const [immatriculation, setImmatriculation] = useState(""); // Plaque d'immatriculation
  const [carburant, setCarburant] = useState(""); // Type de carburant
  const [marque, setMarque] = useState(""); // Marque du véhicule
  const [modele, setModele] = useState(""); // Modèle du véhicule
  const [annee, setAnnee] = useState(""); // Année de mise en circulation

  // Options pour le carburant
  const fuelOptions = [
    { id: "SP98", value: "SP98" },
    { id: "SP95", value: "SP95" },
    { id: "Gasoil", value: "Gasoil" },
    { id: "E85", value: "E85" },
  ];

  // Chargement des données du véhicule à partir de Firestore à l'ouverture de l'écran
  useEffect(() => {
    const fetchVehicleData = async () => {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid, // Récupération de l'ID de l'utilisateur connecté
        "vehicles",
        vehicleId // ID du véhicule à modifier
      );
      const docSnap = await getDoc(docRef); // Récupération du document
      if (docSnap.exists()) {
        const vehicleData = docSnap.data(); // Récupération des données du véhicule
        // Mise à jour des états locaux avec les données récupérées
        setLabel(vehicleData.label);
        setType(vehicleData.type);
        setImmatriculation(vehicleData.immatriculation);
        setCarburant(vehicleData.carburant);
        setMarque(vehicleData.marque);
        setModele(vehicleData.modele);
        setAnnee(vehicleData.annee);
      }
    };
    fetchVehicleData(); // Appel de la fonction pour charger les données du véhicule
  }, [vehicleId]); // Exécution de l'effet à chaque changement de l'ID du véhicule

  // Fonction pour gérer la mise à jour du véhicule
  const handleUpdateVehicle = async () => {
    if (
      label &&
      type &&
      immatriculation &&
      carburant &&
      marque &&
      modele &&
      annee
    ) {
      try {
        // Mise à jour des informations du véhicule dans Firestore
        await updateDoc(
          doc(db, "users", auth.currentUser.uid, "vehicles", vehicleId), // Chemin du document à mettre à jour
          {
            label,
            type,
            immatriculation,
            carburant,
            marque,
            modele,
            annee,
          }
        );
        // Affichage d'une alerte de confirmation
        Alert.alert("Véhicule mis à jour !");
        navigation.navigate("VehicleScreen"); // Retour à l'écran des véhicules
      } catch (error) {
        console.error("Erreur lors de la mise à jour du véhicule", error); // Gestion des erreurs
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs."); // Affichage d'une alerte si un champ est vide
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
          <Text style={tw`text-2xl font-bold m-5`}>Modifier un véhicule</Text>
        </View>
        {/* Formulaire de modification du véhicule */}
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <View style={tw`p-4`}>
            <TextInput
              style={tw`border-b p-2 mb-4`} // Style du champ de texte
              placeholder="Label" // Placeholder
              value={label} // Valeur du label
              onChangeText={setLabel} // Mise à jour de l'état
            />
            <TextInput
              style={tw`border-b p-2 mb-4`}
              placeholder="Type (voiture, moto, scooter, camionette)"
              value={type}
              onChangeText={setType}
            />
            <TextInput
              style={tw`border-b p-2 mb-4`}
              placeholder="Plaque d'immatriculation"
              value={immatriculation}
              onChangeText={setImmatriculation}
            />
            {/* Liste déroulante pour le carburant */}
            <SelectList
              setSelected={setCarburant} // Mise à jour de l'état pour le carburant
              placeholder="Carburant"
              data={fuelOptions} // Données de la liste déroulante
              defaultOption={{ key: carburant, value: carburant }} // Valeur pré-sélectionnée
            />
            <TextInput
              style={tw`border-b p-2 mb-4`}
              placeholder="Marque"
              value={marque}
              onChangeText={setMarque}
            />
            <TextInput
              style={tw`border-b p-2 mb-4`}
              placeholder="Modèle"
              value={modele}
              onChangeText={setModele}
            />
            <TextInput
              style={tw`border-b p-2 mb-4`}
              placeholder="Année de circulation"
              keyboardType="numeric" // Clavier numérique pour l'année
              value={annee}
              onChangeText={setAnnee}
            />
            {/* Bouton pour soumettre les modifications */}
            <TouchableOpacity
              onPress={handleUpdateVehicle} // Appel de la fonction de mise à jour
              style={tw`bg-[#34469C] px-4 py-3 rounded-full flex w-3/4`}
            >
              <Text style={tw`text-white text-sm`}>Mettre à jour le véhicule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Export du composant
export default EditVehicleScreen;
