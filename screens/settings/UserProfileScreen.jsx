import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

const UserProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setPhoneNumber(data.phoneNumber);
          setIsProfessional(data.isProfessional);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          username,
          firstName,
          lastName,
          email,
          phoneNumber,
        });
        Alert.alert("Profil mis à jour !");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const navigateToAddBusiness = () => {
    navigation.navigate("AddBusinessScreen");
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
        <Text style={tw`text-2xl font-bold m-5`}>Modifier votre profil</Text>
      </View>
      <View style={tw`p-4 flex-1 justify-center items-center`}>
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Pseudo"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Nom de famille"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Numéro de téléphone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <View style={tw`flex items-center`}>
          <TouchableOpacity
            onPress={handleUpdateProfile}
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Mettre à jour le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="Mon entreprise"
            onPress={navigateToAddBusiness}
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Ajouter mon entreprise</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfileScreen;
