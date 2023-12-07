import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
// import firestore from '@react-native-firebase/firestore';

const RefuelPastReservation = () => {
//  const [reservations, setReservations] = useState([]);

//  useEffect(() => {
//    const fetchReservations = async () => {
//      const reservationsSnapshot = await firestore()
//        .collection('reservations')
//        .get();

//      const reservationsData = reservationsSnapshot.docs.map(doc => doc.data());
//      setReservations(reservationsData);
//    };

//    fetchReservations();
//  }, []);

const reservations = [
    {
        index: '1',
        address: '45 avenue Georges Politzer',
        date: '19/11/23 - 14:00',
        price: '19,99€'
    },
    {
        index: '2',
        address: '42 avenue Georges Politzer',
        date: '19/11/23 - 14:00',
        price: '19,99€'
    },
    {
        index: '2',
        address: '10 rue de Paris',
        date: '19/11/23 - 14:00',
        price: '19,99€'
    }
]

 return (
   <View>
     {reservations.map((reservation, index) => (
       <TouchableOpacity key={index} style={tw`flex-row justify-between items-center bg-white p-4 rounded-lg mx-4 mt-4`}>
         <View style={tw`w-12 h-12 rounded-full bg-gray-200 items-center justify-center`}>
           <Icon name="car-repair" size={24} color="black" />
         </View>
         <View style={tw`flex-1 ml-10`}>
           <Text style={tw`text-xl font-bold text-black`}>{reservation.address}</Text>
           <Text style={tw`text-sm text-gray-500`}>{reservation.date}</Text>
           <Text style={tw`text-xs text-gray-500`}>{reservation.price}</Text>     
         </View> 
       </TouchableOpacity>
     ))}
   </View>
 );
};

export default RefuelPastReservation;
