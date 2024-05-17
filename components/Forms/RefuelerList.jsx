import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
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
          <Text>{item.firstName}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default RefuelerList;
