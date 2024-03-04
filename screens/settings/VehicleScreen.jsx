import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SelectList,
} from "react-native-dropdown-select-list";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const VehicleScreen = () => {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [carburant, setCarburant] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [annee, setAnnee] = useState("");
  const [vehicles, setVehicles] = useState([]);

  const navigation = useNavigation();
  
  const fuelOptions = [
    { id: "SP98", value: "SP98" },
    { id: "SP95", value: "SP95" },
    { id: "Gasoil", value: "Gasoil" },
    { id: "E85", value: "E85" },
  ];

  useEffect(() => {
    loadVehicles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadVehicles();
    }, [])
  );

  const navigateToEditVehicle = (vehicleId) => {
    navigation.navigate("EditVehicleScreen", {
      vehicleId,
      onGoBack: () => loadVehicles(),
    });
  };

  const loadVehicles = async () => {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "vehicles")
      );
      const userVehicles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(userVehicles);
    }
  };

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
        Alert.alert("Véhicule ajouté !");
        setLabel("");
        setType("");
        setImmatriculation("");
        setCarburant("");
        setMarque("");
        setModele("");
        setAnnee("");
        loadVehicles();
      } catch (error) {
        console.error("Erreur lors de l'ajout du véhicule", error);
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    }
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "vehicles", vehicleId)
      );
      Alert.alert("Véhicule supprimé !");
      loadVehicles(); // Recharger la liste après la suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule", error);
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
        <Image style={tw`w-60 h-30`} source={swippLogo} />
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Ajouter un véhicule</Text>
      </View>
      {/* Affichage des véhicules existants */}
      {vehicles.map((vehicle, index) => (
        <View
          key={index}
          style={tw`m-4 p-4 bg-white rounded-lg flex-row justify-between items-center`}
        >
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
        {/* <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Type de carburant (diesel, SP98, SP95, gasoil...)"
          autoCapitalize="characters"
          value={carburant}
          onChangeText={setCarburant}
        /> */}
        <View style={tw`w-80 mb-4`}>
          <SelectList
            setSelected={(itemValue) => setCarburant(itemValue)}
            placeholder="Carburant"
            data={fuelOptions}
            // boxStyles={{ borderColor: "#34469C", backgroundColor: "white" }}
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
