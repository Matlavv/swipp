// Importation des dépendances nécessaires
import React, { useEffect, useState } from "react"; // Hooks React pour la gestion des états et des effets
import {
  Alert, // Pour afficher des alertes
  ScrollView, // Pour créer une zone défilante
  Text, // Pour afficher du texte
  TextInput, // Pour les champs de saisie
  TouchableOpacity, // Pour les boutons cliquables
  View, // Conteneur de vues
} from "react-native"; // Composants React Native
import RNPickerSelect from "react-native-picker-select"; // Composant pour le sélecteur
import tw from "twrnc"; // Utilisation de Tailwind CSS pour le style
import { Ionicons } from "@expo/vector-icons"; // Icônes Ionicons
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Fonctions Firestore pour récupérer et mettre à jour les documents
import { auth, db } from "../../../firebaseConfig"; // Configuration Firestore et authentification Firebase

// Composant RefuelInfos pour gérer les informations d'un refueler
const RefuelInfos = ({ navigation }) => {
  // États pour les informations du refueler
  const [refuelerPhone, setRefuelerPhone] = useState("");
  const [refuelerAddress, setRefuelerAddress] = useState("");
  const [fuelTypes, setFuelTypes] = useState([]); // Liste des types de carburant
  const [selectedFuelType, setSelectedFuelType] = useState(null); // Type de carburant sélectionné
  const [newFuelPrice, setNewFuelPrice] = useState(""); // Prix du nouveau type de carburant
  const [options, setOptions] = useState([]); // Liste des options avec prix
  const [selectedOption, setSelectedOption] = useState(null); // Option sélectionnée
  const [optionPrice, setOptionPrice] = useState(""); // Prix de la nouvelle option

  // Liste des types de carburant disponibles
  const fuelOptions = [
    { label: 'SP98', value: 'SP98' },
    { label: 'SP95', value: 'SP95' },
    { label: 'Gasoil', value: 'Gasoil' },
    { label: 'E85', value: 'E85' },
  ];

  // Liste des options disponibles
  const availableOptions = [
    { label: 'AdBlue', value: 'adblue' },
    { label: 'Lave vitre', value: 'lave_vitre' },
    { label: 'Gonflage de pneus', value: 'gonflage_pneus' },
    { label: 'Liquide de refroidissement', value: 'liquide_refroidissement' },
  ];

  // Effet pour récupérer les données du refueler depuis Firestore à l'ouverture du composant
  useEffect(() => {
    const fetchRefuelerData = async () => {
      const user = auth.currentUser; // Récupération de l'utilisateur connecté
      if (user) {
        const docRef = doc(db, "users", user.uid); // Référence au document utilisateur dans Firestore
        const docSnap = await getDoc(docRef); // Récupération du document utilisateur
        if (docSnap.exists()) {
          const data = docSnap.data(); // Extraction des données
          setRefuelerPhone(data.refueler_phone || ""); // Mise à jour du numéro de téléphone
          setRefuelerAddress(data.refueler_address || ""); // Mise à jour de l'adresse
          setFuelTypes(data.fuelTypes || []); // Mise à jour des types de carburant
          setOptions(data.options || []); // Mise à jour des options
        }
      }
    };

    fetchRefuelerData(); // Appel de la fonction pour récupérer les données
  }, []);

  // Fonction pour ajouter ou mettre à jour un type de carburant
  const handleAddFuelType = () => {
    if (!selectedFuelType || !newFuelPrice) {
      Alert.alert("Erreur", "Veuillez sélectionner un type d'essence et entrer un prix.");
      return;
    }

    const existingFuelIndex = fuelTypes.findIndex(fuel => fuel.type === selectedFuelType);

    // Si le type de carburant existe déjà, on met à jour son prix, sinon on l'ajoute
    if (existingFuelIndex !== -1) {
      const updatedFuelTypes = [...fuelTypes];
      updatedFuelTypes[existingFuelIndex].price = newFuelPrice;
      setFuelTypes(updatedFuelTypes);
    } else {
      setFuelTypes([...fuelTypes, { type: selectedFuelType, price: newFuelPrice }]);
    }

    // Réinitialisation de la sélection et du prix
    setSelectedFuelType(null);
    setNewFuelPrice("");
  };

  // Fonction pour ajouter ou mettre à jour une option
  const handleAddOption = () => {
    if (!selectedOption || !optionPrice) {
      Alert.alert("Erreur", "Veuillez sélectionner une option et entrer un prix.");
      return;
    }

    const existingOptionIndex = options.findIndex(option => option.type === selectedOption);

    // Si l'option existe déjà, on met à jour son prix, sinon on l'ajoute
    if (existingOptionIndex !== -1) {
      const updatedOptions = [...options];
      updatedOptions[existingOptionIndex].price = optionPrice;
      setOptions(updatedOptions);
    } else {
      setOptions([...options, { type: selectedOption, price: optionPrice }]);
    }

    // Réinitialisation de la sélection et du prix
    setSelectedOption(null);
    setOptionPrice("");
  };

  // Fonction pour supprimer un type de carburant
  const handleRemoveFuelType = (index) => {
    const updatedFuelTypes = [...fuelTypes];
    updatedFuelTypes.splice(index, 1);
    setFuelTypes(updatedFuelTypes);
  };

  // Fonction pour supprimer une option
  const handleRemoveOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  // Fonction pour mettre à jour les informations du refueler dans Firestore
  const handleUpdateRefuelerInfo = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            // Vérification du format du numéro de téléphone
            if (!refuelerPhone || refuelerPhone.length !== 10) {
                Alert.alert("Erreur", "Le numéro de téléphone doit contenir exactement 10 chiffres.");
                return;
            }

            if (!refuelerAddress) {
                Alert.alert("Erreur", "L'adresse du refueler doit être renseignée.");
                return;
            }

            // Mise à jour du document utilisateur dans Firestore avec les nouvelles informations
            await updateDoc(doc(db, "users", user.uid), {
                refueler_phone: refuelerPhone,
                refueler_address: refuelerAddress,
                fuelTypes: fuelTypes,
                options: options, // Mise à jour des options
            });

            Alert.alert("Succès", "Les informations ont été mises à jour !");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour des informations", error);
        Alert.alert(
            "Erreur",
            "Une erreur est survenue lors de la mise à jour des informations. Veuillez réessayer."
        );
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      {/* En-tête avec l'icône de retour et le titre */}
      <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
        <Ionicons name="car-outline" size={50} color="gray" />
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Modifier Refueler Info</Text>
      </View>

      {/* Formulaire pour la saisie des informations */}
      <View style={tw`p-4 flex-1 justify-center items-center`}>
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Numéro du refueler"
          value={refuelerPhone}
          onChangeText={setRefuelerPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Adresse du refueler"
          value={refuelerAddress}
          onChangeText={setRefuelerAddress}
        />

        {/* Section pour gérer les types de carburant */}
        <View style={tw`w-80 mb-4`}>
          <Text style={tw`text-xl font-bold mb-2`}>Types d'essence</Text>
          {fuelTypes.map((fuel, index) => (
            <View key={`fuel-${index}`} style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-lg`}>{fuel.type} - {fuel.price} €</Text>
              <TouchableOpacity onPress={() => handleRemoveFuelType(index)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Sélection du type de carburant */}
        <RNPickerSelect
          onValueChange={(value) => setSelectedFuelType(value)}
          items={fuelOptions}
          value={selectedFuelType}
          placeholder={{ label: "Sélectionnez le type d'essence", value: null }}
          style={{
            inputAndroid: { color: 'black' },
            inputIOS: { color: 'black' }
          }}
        />

        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Prix de l'essence (€)"
          value={newFuelPrice}
          onChangeText={setNewFuelPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={handleAddFuelType}
          style={tw`bg-[#34469C] px-5 py-3 rounded-full mb-4`}
        >
          <Text style={tw`text-white text-sm`}>Ajouter le type d'essence</Text>
        </TouchableOpacity>

        {/* Section pour gérer les options */}
        <View style={tw`w-80 mb-4`}>
          <Text style={tw`text-xl font-bold mb-2`}>Options</Text>
          {options.map((option, index) => (
            <View key={`option-${index}`} style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-lg`}>{option.type} - {option.price} €</Text>
              <TouchableOpacity onPress={() => handleRemoveOption(index)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Sélection de l'option */}
        <RNPickerSelect
          onValueChange={(value) => setSelectedOption(value)}
          items={availableOptions}
          value={selectedOption}
          placeholder={{ label: "Sélectionnez une option", value: null }}
          style={{
            inputAndroid: { color: 'black' },
            inputIOS: { color: 'black' }
          }}
        />

        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Prix de l'option (€)"
          value={optionPrice}
          onChangeText={setOptionPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={handleAddOption}
          style={tw`bg-[#34469C] px-5 py-3 rounded-full mb-4`}
        >
          <Text style={tw`text-white text-sm`}>Ajouter l'option</Text>
        </TouchableOpacity>

        {/* Bouton pour mettre à jour les informations du refueler */}
        <TouchableOpacity
          onPress={handleUpdateRefuelerInfo}
          style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7`}
        >
          <Text style={tw`text-white text-sm`}>Mettre à jour les infos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RefuelInfos;
