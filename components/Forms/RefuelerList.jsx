import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { db } from "../../firebaseConfig";

const RefuelerList = ({ onSelectRefueler }) => {
  const [refuelers, setRefuelers] = useState([]);

  useEffect(() => {
    const fetchRefuelers = async () => {
      const refuelersCollection = collection(db, "users");
      const refuelersQuery = query(
        refuelersCollection,
        where("role", "==", "refueler")
      );
      const querySnapshot = await getDocs(refuelersQuery);
      const refuelers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRefuelers(refuelers);
    };

    fetchRefuelers();
  }, []);

  return (
    <FlatList
      data={refuelers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelectRefueler(item)}>
          <View style={tw`flex-row justify-between items-center p-4 border-b`}>
            <Image
              source={{ uri: item.profileImageUrl }}
              style={tw`w-12 h-12 rounded-full`}
            />
            <Text style={tw`text-lg font-semibold`}>
              {item.firstName} - {item.phoneNumber}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default RefuelerList;
