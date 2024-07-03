import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const EditVehicleScreen = ({ route, navigation }) => {
  const { vehicleId, onGoBack } = route.params;
  const [label, setLabel] = useState("");
  const [type, setType] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [carburant, setCarburant] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [annee, setAnnee] = useState("");

  useEffect(() => {
    const fetchVehicleData = async () => {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "vehicles",
        vehicleId
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const vehicleData = docSnap.data();
        setLabel(vehicleData.label);
        setType(vehicleData.type);
        setImmatriculation(vehicleData.immatriculation);
        setCarburant(vehicleData.carburant);
        setMarque(vehicleData.marque);
        setModele(vehicleData.modele);
        setAnnee(vehicleData.annee);
      }
    };
    fetchVehicleData();
  }, [vehicleId]);

  const handleUpdateVehicle = async () => {
    try {
      await updateDoc(
        doc(db, "users", auth.currentUser.uid, "vehicles", vehicleId),
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
      Alert.alert("Véhicule mis à jour !");
      navigation.goBack(); // Retourner à la page précédente
    } catch (error) {
      console.error("Erreur lors de la mise à jour du véhicule", error);
    }
    if (onGoBack) onGoBack();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={tw`flex-1 mt-5`}>
      <ScrollView>
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
          <Text style={tw`text-2xl font-bold m-5`}>Modifier un véhicule</Text>
        </View>
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <View style={tw`p-4`}>
            <TextInput
              style={tw`border-b p-2 mb-4`}
              placeholder="Label"
              value={label}
              onChangeText={setLabel}
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
            <TextInput
              style={tw`border-b p-2 mb-4`}
              placeholder="Type de carburant (diesel, SP98, SP95, gasoil, E85)"
              value={carburant}
              onChangeText={setCarburant}
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
              keyboardType="numeric"
              value={annee}
              onChangeText={setAnnee}
            />
            <TouchableOpacity
              onPress={handleUpdateVehicle}
              style={tw`bg-[#34469C] px-4 py-3 rounded-full flex w-3/4`}
            >
              <Text style={tw`text-white text-sm`}>
                Mettre à jour le véhicule
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditVehicleScreen;
