import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AppointmentDateForm = ({ route }) => {
  const { address } = route.params;
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAvailableAppointments = async () => {
      try {
        // Requête pour obtenir les chauffeurs proches et leurs disponibilités
        const q = query(collection(db, "drivers"), where("location", "==", address));
        const querySnapshot = await getDocs(q);
    
        let appointments = [];
        querySnapshot.forEach((doc) => {
          const chauffeurData = doc.data();
          // Supposons que chauffeurData.disponibilites est un tableau de créneaux
          chauffeurData.disponibilites.forEach((creneau) => {
            if (creneau.isAvailable) {
              appointments.push({
                driverId: doc.id,
                ...creneau
              });
            }
          });
        });
    
        setAvailableAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments', error);
      }
    };
  });    

  const handleSelectAppointment = async (appointment) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Ajouter la réservation à Firestore
        await addDoc(collection(db, 'RefuelBookings'), {
          clientId: user.uid,
          driverId: appointment.driverId,
          date: appointment.date,
          time: appointment.time
        });
  
        // Mettre à jour la disponibilité du chauffeur

  
        Alert.alert("Rendez-vous réservé !");
      } catch (error) {
        console.error('Error booking appointment', error);
      }
    }
  };
  

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      <View style={tw`p-4`}>
        {availableAppointments.map((appointment, index) => (
          <Button
            key={index}
            title={`Réserver pour ${appointment.date}`}
            onPress={() => handleSelectAppointment(appointment)}
          />
        ))}
        <Text>Sélectionnez un créneau pour une livraison à {address}</Text>
      </View>
    </ScrollView>
  );
};

export default AppointmentDateForm;
