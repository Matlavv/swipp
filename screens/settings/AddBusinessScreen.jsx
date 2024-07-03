import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
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
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const AddBusinessScreen = ({ navigation }) => {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(
          collection(db, "users", user.uid, "businesses")
        );
        if (!querySnapshot.empty) {
          const businessData = querySnapshot.docs[0].data();
          setBusinessId(querySnapshot.docs[0].id);
          setBusinessName(businessData.businessName);
          setBusinessAddress(businessData.businessAddress);
          setBusinessPhone(businessData.businessPhone);
        }
      }
    };

    fetchBusinessData();
  }, []);

  const handleAddOrUpdateBusiness = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const businessData = {
          businessName,
          businessAddress,
          businessPhone,
          // Autres champs
        };

        if (businessId) {
          // Mise à jour de l'entreprise existante
          await updateDoc(
            doc(db, "users", user.uid, "businesses", businessId),
            businessData
          );
          Alert.alert("Business Updated!");
        } else {
          // Ajout d'une nouvelle entreprise
          await addDoc(
            collection(db, "users", user.uid, "businesses"),
            businessData
          );
          Alert.alert("Votre entreprise a été ajoutée !");
        }
      } catch (error) {
        console.error("Error adding/updating business", error);
      }
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
        <Text style={tw`text-2xl font-bold m-5`}>Ajouter votre entreprise</Text>
      </View>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Nom de l'entreprise"
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Adresses de l'entreprise"
          value={businessAddress}
          onChangeText={setBusinessAddress}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Numéro de téléphone"
          value={businessPhone}
          onChangeText={setBusinessPhone}
        />
        <View style={tw`flex items-center`}>
          <TouchableOpacity
            title="Mon entreprise"
            onPress={handleAddOrUpdateBusiness}
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Ajouter mon entreprise</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddBusinessScreen;
