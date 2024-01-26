import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Button,
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

const AdressScreen = () => {
  const [adresse, setAdresse] = useState("");
  const [adresses, setAdresses] = useState([]);
  const [pays, setPays] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [label, setLabel] = useState("");

  const navigation = useNavigation();

  const loadAdresses = async () => {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "adresses")
      );
      const userAdresses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdresses(userAdresses);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAdresses();
    }, [])
  );

  const navigateToEditAdress = (adressId) => {
    navigation.navigate("EditAdressScreen", {
      adressId,
      onGoBack: () => loadAdresses(),
    });
  };

  const handleSaveAddress = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "users", user.uid, "adresses"), {
          adresse,
          pays,
          ville,
          codePostal,
          label,
        });
        // Réinitialiser les champs ou naviguer ailleurs
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'adresse", error);
      }
    }
    loadAdresses();
  };

  const deleteAdress = async (adressId) => {
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "adresses", adressId)
      );
      Alert.alert("Adresse supprimée !");
      loadAdresses(); // Recharger la liste après la suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de l'adresse", error);
    }
    loadAdresses();
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
          <Text style={tw`text-2xl font-bold m-5`}>Ajouter une adresse</Text>
        </View>
        {adresses.map((adresse, index) => (
          <View key={index}>
            <TouchableOpacity
              style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg mx-4 mt-4`}
            >
              <View style={tw`flex-1`}>
                <Text style={tw`text-2xl font-bold text-black`}>
                  {adresse.label}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {adresse.adresse}, {adresse.ville}
                </Text>
              </View>
              <View
                style={tw`w-12 h-12 rounded-full bg-gray-200 items-center justify-center`}
              >
                <Icon
                  name={adresse.label === "Domicile" ? "home" : "work"}
                  size={24}
                  color="black"
                />
              </View>
            </TouchableOpacity>
            <Button
              title="Modifier"
              onPress={() => navigateToEditAdress(adresse.id)}
            />
            <Button
              title="Supprimer"
              onPress={() => deleteAdress(adresse.id)}
            />
            <View style={tw`bg-gray-200 h-0.2 w-11/12 ml-5`} />
          </View>
        ))}
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
