import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

const DatePickerModal = ({ isVisible, onClose, onDateSelect }) => {
  const [availableDates, setAvailableDates] = useState({});

  useEffect(() => {
    // Récupérer les dates disponibles depuis Firestore
    const fetchDates = async () => {
      const datesDoc = await firestore().collection("availableDates").get();
      // Transformer les données en format attendu par le calendrier
      const dates = datesDoc.docs.reduce((acc, doc) => {
        const date = doc.id;
        if (doc.data().available) {
          acc[date] = { selected: true, selectedColor: "#34469C" };
        }
        return acc;
      }, {});
      setAvailableDates(dates);
    };

    fetchDates();
  }, []);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={tw`m-4 bg-white rounded-lg p-4 shadow-lg`}>
        <Calendar
          // Marquer les dates disponibles
          markedDates={availableDates}
          // Action lors de la sélection d'une date
          onDayPress={(day) => {
            if (availableDates[day.dateString]) {
              onDateSelect(day.dateString);
              onClose();
            } else {
              alert("Cette date n'est pas disponible.");
            }
          }}
        />
        <TouchableOpacity onPress={onClose} style={tw`items-center`}>
          <Text style={tw`text-blue-900 m-2 font-semibold`}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default DatePickerModal;
