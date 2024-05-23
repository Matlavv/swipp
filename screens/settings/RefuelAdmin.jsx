import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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

const RefuelAdmin = () => {
  const [date, setDate] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState({});
  const user = auth.currentUser;

  const getFuelTypeFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 1];
  };

  const getPlateFromVehicleId = (vehicleId) => {
    const parts = vehicleId.split(" - ");
    return parts[parts.length - 2];
  };

  const fetchUserData = async (userId) => {
    const userDoc = doc(db, "users", userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData;
    }
    return null;
  };

  const fetchUsersData = async (bookings) => {
    const usersData = {};
    for (const booking of bookings) {
      if (!usersData[booking.userId]) {
        usersData[booking.userId] = await fetchUserData(booking.userId);
      }
    }
    setUsers(usersData);
  };

  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      getDoc(userDoc).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      });

      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (user) {
      const q = query(
        collection(db, "RefuelBookings"),
        where("refuelerId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
      fetchUsersData(bookingsData);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("fr-CA", options); // Format date as YYYY-MM-DD
  };

  const changeDate = (increment) => {
    const newDate = new Date(date.setDate(date.getDate() + increment));
    setDate(newDate);
  };

  const parseBookingHour = (bookingHour) => {
    const parts = bookingHour.split("h - ");
    const startHour = parseInt(parts[0], 10);
    return startHour;
  };

  const filteredBookings = bookings
    .filter((booking) => {
      const bookingDate = booking.bookingDate || booking.date;
      const formattedDate = formatDate(date);
      return bookingDate === formattedDate;
    })
    .sort(
      (a, b) =>
        parseBookingHour(a.bookingHour) - parseBookingHour(b.bookingHour)
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
              <View key={booking.id}>
                <View style={tw`flex items-center justify-center`}>
                  <Text style={tw`text-lg font-semibold`}>
                    {booking.bookingHour}
                  </Text>
                </View>
                <TouchableOpacity
                  style={tw`flex flex-row justify-between items-center p-5 border-b-2 border-gray-200`}
                >
                  {/* first column, name & adress & phone */}
                  <View style={tw`flex w-50`}>
                    <Text style={tw`font-semibold text-lg`}>
                      {users[booking.userId]?.firstName}{" "}
                      {users[booking.userId]?.lastName}
                    </Text>
                    <Text style={tw`text-gray-600 font-semibold text-base`}>
                      {users[booking.userId]?.phoneNumber}
                    </Text>
                    <Text style={tw`font-semibold text-base`}>
                      {booking.address}
                    </Text>
                  </View>
                  <View style={tw`border-r h-full`}></View>
                  {/* Car informations */}
                  <View style={tw`ml-5`}>
                    <Text style={tw`text-lg font-semibold`}>
                      {getFuelTypeFromVehicleId(booking.vehicleId)}
                    </Text>
                    <Text style={tw`text-lg font-semibold`}>
                      {getPlateFromVehicleId(booking.vehicleId)}
                    </Text>
                    <Text style={tw`text-lg font-semibold`}>
                      {booking.volume} Litres
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
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
