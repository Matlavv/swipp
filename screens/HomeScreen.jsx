import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { swippLogo } from "../assets";
import DisplayAdress from "../components/DisplayAdress";
import NavOptions from "../components/NavOptions";
import SuggestedList from "../components/SuggestedList";
import { auth, db } from "../firebaseConfig";

const HomeScreen = () => {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
            console.log("Document utilisateur introuvable");
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données utilisateur",
            error
          );
        }
      }
    };
    fetchUserData();
  }, []);

  const navigateToServiceScreen = () => {
    navigation.navigate("Services");
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        {/* Logo */}
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>
        <Text style={tw`text-2xl font-bold m-5`}>
          Bonjour {username || "!"} 👋
        </Text>
        <View style={tw`flex`}>
          <NavOptions />
        </View>
        {/* Suggestions section */}
        <View style={tw`flex flex-row justify-between items-center p-2 mt-5`}>
          <Text style={tw`text-2xl font-semibold`}>Populaire</Text>
          <TouchableOpacity onPress={navigateToServiceScreen}>
            <Text style={tw`font-light`}>Tout afficher</Text>
          </TouchableOpacity>
        </View>
        <SuggestedList />
        {/* My adresses */}
        <View style={tw`flex mt-5 p-2`}>
          <Text style={tw`text-2xl font-semibold`}>
            Faites vous livrer votre plein
          </Text>
          <DisplayAdress />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
