import { Ionicons } from "@expo/vector-icons";
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
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const bookings = [
  {
    id: 1,
    date: "17/05/2024",
    time: "13h-14h",
    vehicleId: "206+ - ABC-123-DEF",
    fuelType: "SP98",
    userId: "John Doe",
    volume: "20",
  },
  {
    id: 2,
    date: "17/05/2024",
    time: "13h-14h",
    vehicleId: "206+ - ABC-123-DEF",
    fuelType: "SP98",
    userId: "John Doe",
    volume: "20",
  },
  {
    id: 3,
    date: "18/05/2024",
    time: "13h-14h",
    vehicleId: "206+ - ABC-123-DEF",
    fuelType: "SP98",
    userId: "John Doe",
    volume: "20",
  },
];

const RefuelAdmin = () => {
  const [date, setDate] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      getDoc(userDoc).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setFirstName(docSnapshot.data().firstName);
          setLastName(docSnapshot.data().lastName);
        }
      });
    }
  }, [user]);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  };

  const changeDate = (increment) => {
    setDate(new Date(date.setDate(date.getDate() + increment)));
  };

  const filteredBookings = bookings.filter(
    (booking) => booking.date === formatDate(date)
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`flex p-5 mt-5 justify-start items-start flex flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
          <View style={tw`flex items-end ml-4`}>
            <Text style={tw`text-lg font-semibold`}>
              Chauffeur : {firstName} {lastName}
            </Text>
            <Text style={tw`text-lg font-semibold`}>
              Date : {formatDate(new Date())}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row items-center justify-center`}>
          <TouchableOpacity onPress={() => changeDate(-1)}>
            <Ionicons name="chevron-back-circle" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-semibold mx-2`}>
            Réservations du {formatDate(date)}
          </Text>
          <TouchableOpacity onPress={() => changeDate(1)}>
            <Ionicons name="chevron-forward-circle" size={30} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={tw`p-3 border-b-2 border-gray-400`}></View>
        {/* List of reservations */}
        <View>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={tw`flex flex-row justify-between items-center p-5 border-b-2 border-gray-200`}
              >
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-semibold`}>{booking.date}</Text>
                  <Text style={tw`text-lg font-semibold`}>{booking.time}</Text>
                  <Text style={tw`text-lg font-semibold`}>
                    {booking.userId}
                  </Text>
                </View>
                <Text style={tw`flex-1 text-center text-lg font-semibold`}>
                  {booking.vehicleId}
                </Text>
                <View style={tw`flex-1 items-end`}>
                  <Text style={tw`text-lg font-semibold`}>
                    {booking.fuelType}
                  </Text>
                  <Text style={tw`text-lg font-semibold`}>
                    {booking.volume}L
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={tw`text-center text-lg p-5`}>
              Aucune réservation pour cette date.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RefuelAdmin;
