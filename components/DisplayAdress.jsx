import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { collection, getDocs, limit, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { AuthContext } from "../AuthContext";
import { auth, db } from "../firebaseConfig";

const DisplayAdress = () => {
  const [adresses, setAdresses] = useState([]);
  const navigation = useNavigation();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchAdresses = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(db, "users", user.uid, "adresses"),
            limit(2)
          );
          const querySnapshot = await getDocs(q);
          const userAdresses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAdresses(userAdresses);
        } catch (error) {
          console.error("Erreur lors de la récupération des adresses", error);
        }
      }
    };
    fetchAdresses();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, "users", currentUser.uid, "adresses"),
        limit(2)
      );
    } else {
      setAdresses([]);
    }
  }, [currentUser]);

  return (
    <ScrollView style={tw`flex-1 mb-10 mt-3`}>
      {adresses.map((adresse) => (
        <TouchableOpacity
          key={adresse.id}
          style={tw`flex-row items-center bg-white px-4 py-2 rounded-lg mx-2 my-2`}
          onPress={() => {
            navigation.navigate("RefuelForm", {
              address: `${adresse.adresse}, ${adresse.ville}`,
            });
          }}
        >
          <View
            style={tw`w-12 h-12 rounded-full bg-[#E6E6E6] items-center justify-center mr-4`}
          >
            <Icon name="location-pin" size={24} color="#34469C" />
          </View>
          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`text-xl font-bold text-black`}>
              {adresse.label}
            </Text>
            <Text style={tw`mt-1 text-sm text-gray-500`}>
              {adresse.adresse}, {adresse.ville}
            </Text>
          </View>
          <Icon name="chevron-right" size={35} color="#34469C" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DisplayAdress;
