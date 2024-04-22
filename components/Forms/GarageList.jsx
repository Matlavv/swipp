import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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
import GaragesDetailsModal from "../GaragesDetailsModal";

const GarageList = ({ searchTerm, onSelectGarage }) => {
  const [garages, setGarages] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  const handleSelectGarage = (garage) => {
    setSelectedGarage(garage);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchGarages = async () => {
      let queries = [];
      const formattedSearch = searchTerm.trim().toLowerCase();
      if (formattedSearch) {
        // Ajoutez les requêtes pour la ville et le département
        queries.push(
          query(collection(db, "garages"), where("city", "==", formattedSearch))
        );
        queries.push(
          query(
            collection(db, "garages"),
            where("department", "==", formattedSearch)
          )
        );
      } else {
        // Requête pour tous les garages si aucun terme de recherche
        queries.push(query(collection(db, "garages"), orderBy("city")));
      }

      let uniqueGarages = new Map();
      for (let q of queries) {
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          // Utiliser un Map pour éviter les doublons
          uniqueGarages.set(doc.id, { id: doc.id, ...doc.data() });
        });
      }

      const results = Array.from(uniqueGarages.values());
      if (results.length === 0 && searchTerm) {
        setGarages([]);
        setNoResults(true);
      } else {
        setGarages(results);
        setNoResults(false);
      }
    };

    fetchGarages();
  }, [searchTerm]);

  const onPressGarage = (garageId) => {
    navigation.navigate("GarageDetails", { garageId: garageId });
  };

  return (
    <SafeAreaView style={tw`flex`}>
      <FlatList
        data={garages}
        renderItem={({ item }) => (
          <View style={tw`flex w-95`}>
            <TouchableOpacity
              onPress={() => handleSelectGarage(item)}
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
                    {item.city}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onSelectGarage(item)}
                    style={tw`bg-[#34469C] px-4 py-1 rounded-full flex-row`}
                  >
                    <Text style={tw`text-white text-sm mr-1`}>Réserver</Text>
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
        ListEmptyComponent={() =>
          noResults ? (
            <Text style={tw`text-center text-lg`}>
              Aucun garage trouvé dans la zone indiquée.
            </Text>
          ) : null
        }
      />
      <GaragesDetailsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        garage={selectedGarage}
      />
    </SafeAreaView>
  );
};

export default GarageList;
