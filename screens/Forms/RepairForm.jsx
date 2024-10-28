// Importation des dépendances nécessaires
import { Ionicons } from "@expo/vector-icons"; // Icônes Ionicons
import { collection, getDocs } from "firebase/firestore"; // Récupération des documents Firestore
import React, { useEffect, useState } from "react"; // Hooks React pour la gestion de l'état et des effets
import {
  Alert, // Alerte pour afficher des messages à l'utilisateur
  Image, // Composant Image pour afficher des images
  SafeAreaView, // Composant pour respecter les zones sûres sur les écrans des appareils
  ScrollView, // Permet de faire défiler la vue
  Text, // Composant pour afficher du texte
  TextInput, // Entrée de texte pour permettre à l'utilisateur d'entrer des données
  TouchableOpacity, // Bouton cliquable
  View, // Conteneur de vues
} from "react-native"; // Composants React Native
import { SelectList } from "react-native-dropdown-select-list"; // Liste déroulante pour la sélection d'options
import tw from "twrnc"; // Utilisation de Tailwind CSS pour le style
import { swippLogo } from "../../assets"; // Importation du logo de l'application
import ChooseGarageModal from "../../components/Modal/ChooseGarageModal"; // Importation du modal pour choisir un garage
import { auth, db } from "../../firebaseConfig"; // Importation de Firebase pour l'authentification et Firestore

// Définition du composant principal RepairForm
const RepairForm = ({ route, navigation }) => {
  // Définition des états locaux
  const [selectedValue, setSelectedValue] = useState("Réparation du moteur"); // Réparation sélectionnée
  const [address, setAddress] = useState(""); // Adresse entrée par l'utilisateur
  const [vehicles, setVehicles] = useState([]); // Liste des véhicules de l'utilisateur
  const [selectedVehicleId, setSelectedVehicleId] = useState({ // Identification du véhicule sélectionné
    id: "",
    immatriculationPlate: "",
  });
  const [isGarageModalVisible, setGarageModalVisible] = useState(false); // Visibilité du modal pour choisir un garage
  const [selectedGarage, setSelectedGarage] = useState(""); // Garage sélectionné
  const [selectedPrice, setSelectedPrice] = useState(0); // Prix estimé de la réparation

  // Options de réparation avec les prix correspondants
  const repairOptions = [
    { id: "moteur", value: "Réparation du moteur", price: 100 },
    { id: "transmission", value: "Réparation de la transmission", price: 200 },
    { id: "direction", value: "Réparation de la direction", price: 150 },
    { id: "carrosserie", value: "Réparation de la carrosserie", price: 250 },
    {
      id: "echappement",
      value: "Réparation du système d'échappement",
      price: 180,
    },
  ];

  // Mise à jour de l'adresse si elle est transmise via les paramètres de la route
  useEffect(() => {
    if (route.params?.address) {
      setAddress(route.params.address);
    }
  }, [route.params?.address]);

  // Fonction pour sélectionner un garage
  const handleSelectGarage = (garage) => {
    setSelectedGarage(garage);
  };

  // Chargement des véhicules de l'utilisateur depuis Firestore
  const loadVehicles = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", user.uid, "vehicles")
        );
        const userVehicles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVehicles(userVehicles);
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules", error);
      }
    }
  };

  // Chargement des véhicules au montage du composant
  useEffect(() => {
    loadVehicles();
  }, []);

  // Navigation vers la page de choix de la date de réparation
  const navigateToChooseRepairDate = () => {
    if (!selectedValue || !selectedVehicleId.id || !selectedGarage) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    // Passage des paramètres nécessaires à la page suivante
    navigation.navigate("ChooseRepairDate", {
      selectedValue,
      selectedVehicleId,
      selectedGarage,
      selectedPrice,
    });
  };

  return (
    <SafeAreaView style={tw`flex h-full`}> {/* Conteneur principal avec zone sécurisée */}
      <ScrollView style={tw`flex-1`}> {/* Vue défilable */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} /> {/* Logo de l'application */}
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mt-5 ml-3`}>
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" /> {/* Bouton retour */}
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Réparation du véhicule</Text> {/* Titre de la page */}
        </View>

        {/* Choix du type de réparation */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Sélectionnez votre besoin
          </Text>
          <View style={tw`rounded-md`}>
            <SelectList
              setSelected={(itemValue) => {
                const selectedOption = repairOptions.find(
                  (option) => option.id === itemValue
                );
                if (selectedOption) {
                  setSelectedValue(selectedOption.value); // Mise à jour de la réparation sélectionnée
                  setSelectedPrice(selectedOption.price); // Mise à jour du prix en fonction de la réparation
                }
              }}
              data={repairOptions.map((option) => ({
                key: option.id,
                value: `${option.value} - ${option.price}€`,
              }))}
              placeholder="Sélectionnez votre besoin"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }} // Style de la liste déroulante
            />
          </View>
        </View>

        {/* Choix du véhicule */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>Indiquez le véhicule</Text>
          <View style={tw`rounded-md`}>
            <SelectList
              setSelected={(itemValue) => {
                const selectedVehicle = vehicles.find(
                  (vehicle) => vehicle.id === itemValue
                );
                if (selectedVehicle) {
                  setSelectedVehicleId({
                    id: selectedVehicle.id,
                    immatriculationPlate: selectedVehicle.immatriculation,
                  });
                } else {
                  console.error("Selected vehicle not found");
                  Alert.alert(
                    "Error",
                    "The selected vehicle was not found in the list."
                  );
                }
              }}
              data={vehicles.map((vehicle) => ({
                key: vehicle.id,
                value: `${vehicle.label} - ${vehicle.immatriculation}`,
              }))}
              placeholder="Indiquez le véhicule"
              boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }} // Style de la liste déroulante
            />
          </View>
        </View>

        {/* Choix du garage */}
        <View style={tw`p-3 bg-gray-200 rounded-xl mx-3 mt-3`}>
          <Text style={tw`text-xl font-bold mb-4`}>
            Choisissez votre garage
          </Text>
          <View style={tw`rounded-md`}>
            <TouchableOpacity
              onPress={() => setGarageModalVisible(true)} // Ouverture du modal pour choisir le garage
              style={tw`border-b-2 border-[#34469C] font-bold text-base`}
              value={selectedGarage}
              editable={false}
            >
              <TextInput
                style={tw`text-black font-bold text-base`}
                placeholder="Sélectionnez un garage"
                value={selectedGarage.name} // Affichage du garage sélectionné
                editable={false}
              />
            </TouchableOpacity>

            <ChooseGarageModal
              isVisible={isGarageModalVisible}
              onClose={() => setGarageModalVisible(false)}
              onSelectGarage={handleSelectGarage} // Mise à jour du garage sélectionné
            />
          </View>
        </View>

        {/* Affichage du prix et bouton pour continuer */}
        <View style={tw`mb-4 mt-3 flex items-center`}>
          <Text style={tw`font-bold text-lg`}>Prix : {selectedPrice}</Text>
          <TouchableOpacity
            onPress={navigateToChooseRepairDate} // Navigation vers la sélection de date
            style={tw`bg-[#34469C] p-4 rounded-md w-5/6 items-center mt-3`}
          >
            <Text style={tw`text-white font-semibold text-base`}>
              Choisir une date
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Export du composant
export default RepairForm;
