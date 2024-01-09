import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const convertDateFormat = (dateStr) => {
  // Vérifiez si la date est définie et est une chaîne
  if (!dateStr || typeof dateStr !== 'string') return '';
  
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr; // Retournez la date originale si le format n'est pas correct

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};



const RefuelActiveReservation = () => {
  const [activeReservations, setActiveReservations] = useState([]);

  useEffect(() => {
    const fetchActiveReservations = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'RefuelBookings'), where('userId', '==', user.uid), where('isActive', '==', true));
        const querySnapshot = await getDocs(q);
        const reservations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActiveReservations(reservations);
      }
    };
    fetchActiveReservations();
  }, []);

  return (
    <View>
      {activeReservations.map((reservation, index) => (
        <TouchableOpacity key={index} style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg mx-4 mt-4`}>
          <View style={tw`w-12 h-12 rounded-full bg-gray-200 items-center justify-center`}>
            <Icon name="local-gas-station" size={24} color="#103783" />
          </View>
          <View style={tw`flex-1 ml-10`}>
            <Text style={tw`text-xl font-bold text-black`}>{reservation.address}</Text>
            <Text style={tw`text-sm text-gray-500`}>{reservation.time} - {convertDateFormat(reservation.bookingDate)}</Text>
          </View> 
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RefuelActiveReservation;