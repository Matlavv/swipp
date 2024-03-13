import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { db } from "../../firebaseConfig";

const GarageList = ({ onSelectGarage }) => {
  const [garages, setGarages] = useState([]);

  const loadGarages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "garages"));
      const loadedGarages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGarages(loadedGarages);
    } catch (error) {
      console.error("Erreur lors du chargement des garages", error);
    }
  };

  useEffect(() => {
    loadGarages();
  }, []);

  return (
    <SafeAreaView style={tw`flex`}>
      <FlatList
        data={garages}
        renderItem={({ item }) => (
          <View style={tw`flex w-95`}>
            <TouchableOpacity
              onPress={() => onSelectGarage(item)}
              style={tw`flex mb-4 bg-white rounded-xl border border-gray-200 shadow-xl`}
            >
              <Image
                source={{ uri: item.image }}
                style={tw`h-32 w-full rounded-t-xl`}
              />
              <View style={tw`px-4 py-2 bg-white rounded-b-xl`}>
                <Text style={tw`text-lg font-bold`}>{item.name}</Text>
                <View style={tw`flex-row justify-between pt-2`}>
                  <Text
                    style={tw`text-sm text-black border-2 rounded-full px-3 py-1 border-slate-400`}
                  >
                    {item.description}
                  </Text>
                  <Text
                    style={tw`text-sm text-black border-2 rounded-full px-3 py-1 border-slate-400`}
                  >
                    {item.workerCount} Workers
                  </Text>
                  <TouchableOpacity
                    onPress={() => onSelectGarage(item)}
                    style={tw`bg-[#34469C] px-4 py-1 rounded-full flex-row`}
                  >
                    <Text style={tw`text-white text-sm mr-1`}>Book</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`p-2 ml-2`}
      />
    </SafeAreaView>
  );
};

export default GarageList;
