import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const RefuelInfos = ({ navigation }) => {
  const [refuelerPhone, setRefuelerPhone] = useState("");
  const [refuelerAddress, setRefuelerAddress] = useState("");
  const [fuelTypes, setFuelTypes] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [newFuelPrice, setNewFuelPrice] = useState("");
  const [options, setOptions] = useState([]); // Liste des options avec prix
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionPrice, setOptionPrice] = useState("");

  const fuelOptions = [
    { label: 'SP98', value: 'SP98' },
    { label: 'SP95', value: 'SP95' },
    { label: 'Gasoil', value: 'Gasoil' },
    { label: 'E85', value: 'E85' },
  ];

  const availableOptions = [
    { label: 'AdBlue', value: 'adblue' },
    { label: 'Lave vitre', value: 'lave_vitre' },
    { label: 'Gonflage de pneus', value: 'gonflage_pneus' },
    { label: 'Liquide de refroidissement', value: 'liquide_refroidissement' },
  ];

  useEffect(() => {
    const fetchRefuelerData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRefuelerPhone(data.refueler_phone || "");
          setRefuelerAddress(data.refueler_address || "");
          setFuelTypes(data.fuelTypes || []);
          setOptions(data.options || []); // Charger les options existantes
        }
      }
    };

    fetchRefuelerData();
  }, []);

  const handleAddFuelType = () => {
    if (!selectedFuelType || !newFuelPrice) {
      Alert.alert("Erreur", "Veuillez sélectionner un type d'essence et entrer un prix.");
      return;
    }

    const existingFuelIndex = fuelTypes.findIndex(fuel => fuel.type === selectedFuelType);

    if (existingFuelIndex !== -1) {
      const updatedFuelTypes = [...fuelTypes];
      updatedFuelTypes[existingFuelIndex].price = newFuelPrice;
      setFuelTypes(updatedFuelTypes);
    } else {
      setFuelTypes([...fuelTypes, { type: selectedFuelType, price: newFuelPrice }]);
    }

    // Réinitialiser la sélection du type d'essence et du prix
    setSelectedFuelType(null);
    setNewFuelPrice("");
  };

  const handleAddOption = () => {
    if (!selectedOption || !optionPrice) {
      Alert.alert("Erreur", "Veuillez sélectionner une option et entrer un prix.");
      return;
    }

    const existingOptionIndex = options.findIndex(option => option.type === selectedOption);

    if (existingOptionIndex !== -1) {
      const updatedOptions = [...options];
      updatedOptions[existingOptionIndex].price = optionPrice;
      setOptions(updatedOptions);
    } else {
      setOptions([...options, { type: selectedOption, price: optionPrice }]);
    }

    // Réinitialiser la sélection de l'option et du prix
    setSelectedOption(null);
    setOptionPrice("");
  };

  const handleRemoveFuelType = (index) => {
    const updatedFuelTypes = [...fuelTypes];
    updatedFuelTypes.splice(index, 1);
    setFuelTypes(updatedFuelTypes);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleUpdateRefuelerInfo = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            // Vérification de la longueur du numéro de téléphone
            if (!refuelerPhone || refuelerPhone.length !== 10) {
                Alert.alert("Erreur", "Le numéro de téléphone doit contenir exactement 10 chiffres.");
                return;
            }

            if (!refuelerAddress) {
                Alert.alert("Erreur", "L'adresse du refueler doit être renseignée.");
                return;
            }

            await updateDoc(doc(db, "users", user.uid), {
                refueler_phone: refuelerPhone,
                refueler_address: refuelerAddress,
                fuelTypes: fuelTypes,
                options: options, // Mettre à jour les options
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

        {/* Gestion des types d'essence */}
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

        {/* Gestion des options */}
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
