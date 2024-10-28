// Importation des modules et composants nécessaires
import { Ionicons } from "@expo/vector-icons"; // Pour les icônes Ionicons
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Utilisation de la navigation
import {
  addDoc, // Ajouter des documents dans Firestore
  collection, // Collection dans Firestore
  deleteDoc, // Supprimer des documents dans Firestore
  doc, // Référence à un document dans Firestore
  getDocs, // Récupérer des documents dans Firestore
} from "firebase/firestore"; // Firebase Firestore pour les opérations de base de données
import React, { useEffect, useState } from "react"; // Utilisation des hooks React pour gérer l'état et les effets
import {
  Alert, // Pour afficher des messages d'alerte
  Image, // Afficher des images
  ScrollView, // Composant de défilement pour la liste des véhicules et du formulaire
  Text, // Afficher du texte
  TextInput, // Saisie de texte
  TouchableOpacity, // Boutons cliquables
  View, // Conteneur de vue
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list"; // Composant de sélection déroulante
import tw from "twrnc"; // Tailwind CSS pour les styles
import { swippLogo } from "../../assets"; // Logo de l'application
import { auth, db } from "../../firebaseConfig"; // Configuration Firebase pour l'authentification et Firestore

// Composant principal pour gérer les véhicules de l'utilisateur
const VehicleScreen = () => {
  // États pour stocker les informations du véhicule à ajouter et la liste des véhicules
  const [label, setLabel] = useState(""); // Nom du véhicule
  const [type, setType] = useState(""); // Type de véhicule
  const [immatriculation, setImmatriculation] = useState(""); // Plaque d'immatriculation
  const [carburant, setCarburant] = useState(""); // Type de carburant
  const [marque, setMarque] = useState(""); // Marque du véhicule
  const [modele, setModele] = useState(""); // Modèle du véhicule
  const [annee, setAnnee] = useState(""); // Année de circulation
  const [vehicles, setVehicles] = useState([]); // Liste des véhicules de l'utilisateur

  const navigation = useNavigation(); // Hook pour naviguer entre les écrans

  // Options de carburant disponibles pour le menu déroulant
  const fuelOptions = [
    { id: "SP98", value: "SP98" },
    { id: "SP95", value: "SP95" },
    { id: "Gasoil", value: "Gasoil" },
    { id: "E85", value: "E85" },
  ];

  // Utilisation de useEffect pour charger les véhicules de l'utilisateur au chargement de l'écran
  useEffect(() => {
    loadVehicles();
  }, []);

  // useFocusEffect pour recharger les véhicules lorsque l'utilisateur revient sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      loadVehicles();
    }, [])
  );

  // Fonction pour naviguer vers l'écran d'édition du véhicule
  const navigateToEditVehicle = (vehicleId) => {
    navigation.navigate("EditVehicleScreen", { vehicleId });
    navigation.setOptions({
      onGoBack: () => loadVehicles(), // Recharge les véhicules après modification
    });
  };

  // Fonction pour charger les véhicules de l'utilisateur depuis Firestore
  const loadVehicles = async () => {
    const user = auth.currentUser; // Récupérer l'utilisateur actuellement connecté
    if (user) {
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "vehicles") // Chemin vers la collection "vehicles" de l'utilisateur
      );
      const userVehicles = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Identifiant du véhicule
        ...doc.data(), // Données du véhicule
      }));
      setVehicles(userVehicles); // Mise à jour de l'état des véhicules
    }
  };

  // Fonction pour ajouter un véhicule à Firestore
  const handleAddVehicle = async () => {
    const user = auth.currentUser;
    if (
      user &&
      label &&
      type &&
      immatriculation &&
      carburant &&
      marque &&
      modele &&
      annee
    ) {
      try {
        await addDoc(collection(db, "users", user.uid, "vehicles"), {
          label,
          type,
          immatriculation,
          carburant,
          marque,
          modele,
          annee,
        });
        Alert.alert("Véhicule ajouté !"); // Confirmation de l'ajout
        // Réinitialisation des champs du formulaire
        setLabel("");
        setType("");
        setImmatriculation("");
        setCarburant("");
        setMarque("");
        setModele("");
        setAnnee("");
        loadVehicles(); // Recharge la liste des véhicules
      } catch (error) {
        console.error("Erreur lors de l'ajout du véhicule", error);
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs."); // Alerte si un champ est manquant
    }
  };

  // Fonction pour supprimer un véhicule de Firestore
  const deleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "vehicles", vehicleId)
      );
      Alert.alert("Véhicule supprimé !"); // Confirmation de la suppression
      loadVehicles(); // Recharger la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule", error);
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      {/* Zone d'en-tête avec le logo */}
      <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
        <Image style={tw`w-60 h-30`} source={swippLogo} />
      </View>
      {/* Bouton de retour en arrière et titre de l'écran */}
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Ajouter un véhicule</Text>
      </View>

      {/* Liste des véhicules existants */}
      {vehicles.map((vehicle, index) => (
        <View
          key={index}
          style={tw`m-4 p-4 bg-white rounded-lg flex-row justify-between items-center`}
        >
          {/* Affichage des détails du véhicule et navigation vers l'édition */}
          <TouchableOpacity
            onPress={() => navigateToEditVehicle(vehicle.id)}
            style={tw`flex-1`}
          >
            <Text style={tw`text-lg font-bold`}>{vehicle.label}</Text>
            <Text>
              Modèle: {vehicle.marque} {vehicle.modele} {vehicle.annee}
            </Text>
            <Text>Plaque: {vehicle.immatriculation}</Text>
          </TouchableOpacity>
          {/* Bouton pour supprimer le véhicule */}
          <TouchableOpacity onPress={() => deleteVehicle(vehicle.id)}>
            <Ionicons name="trash" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Formulaire pour ajouter un nouveau véhicule */}
      <View style={tw`m-4 flex-1 justify-center items-center`}>
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Label, ex: Ma voiture"
          value={label}
          onChangeText={setLabel}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Type (voiture, moto, scooter, camionette...)"
          value={type}
          onChangeText={setType}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Plaque d'immatriculation"
          value={immatriculation}
          onChangeText={setImmatriculation}
        />
        {/* Sélecteur pour choisir le type de carburant */}
        <View style={tw`w-80 mb-4`}>
          <SelectList
            setSelected={(itemValue) => setCarburant(itemValue)}
            placeholder="Carburant"
            data={fuelOptions}
          />
        </View>
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Marque"
          value={marque}
          onChangeText={setMarque}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Modèle"
          value={modele}
          onChangeText={setModele}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Année de circulation"
          keyboardType="numeric"
          value={annee}
          onChangeText={setAnnee}
        />
        {/* Bouton pour ajouter le véhicule */}
        <TouchableOpacity
          onPress={handleAddVehicle}
          style={tw`bg-[#34469C] px-4 py-3 rounded-full flex mt-7`}
        >
          <Text style={tw`text-white text-sm`}>Ajouter mon véhicule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VehicleScreen;
