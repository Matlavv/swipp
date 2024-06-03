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

const EditAdressScreen = ({ route, navigation }) => {
  const { adressId } = route.params;
  const [adresse, setAdresse] = useState("");
  const [pays, setPays] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fetchAdressData = async () => {
      const docRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "adresses",
        adressId
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const adressData = docSnap.data();
        setAdresse(adressData.adresse);
        setPays(adressData.pays);
        setVille(adressData.ville);
        setCodePostal(adressData.codePostal);
        setLabel(adressData.label);
      }
    };
    fetchAdressData();
  }, [adressId]);

  const handleUpdateAdress = async () => {
    try {
      await updateDoc(
        doc(db, "users", auth.currentUser.uid, "adresses", adressId),
        {
          adresse,
          pays,
          ville,
          codePostal,
          label,
        }
      );
      Alert.alert("Adresse mise à jour !");
      navigation.goBack(); // Retourner à la page précédente
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse", error);
    }
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
          <Text style={tw`text-2xl font-bold m-5`}>Modifier une adresse</Text>
        </View>
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Adresse"
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
          <TouchableOpacity
            onPress={handleUpdateAdress}
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex w-3/4`}
          >
            <Text style={tw`text-white text-sm`}>Mettre à jour l'adresse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAdressScreen;
