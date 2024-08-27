import { Picker } from "@react-native-picker/picker";
import { BlurView } from "expo-blur";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";
import { db } from "../../firebaseConfig";

const generateTimeSlots = (startHour = 10, endHour = 18) => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour < 10 ? "0" : ""}${hour}:00`);
    if (hour !== endHour) {
      // Pas de demi-heure pour la dernière heure
      slots.push(`${hour < 10 ? "0" : ""}${hour}:30`);
    }
  }
  return slots;
};

const DateTimePickerModal = ({ isVisible, onClose, onConfirm, garageId }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (garageId && selectedDay) {
      const fetchAvailableSlots = async () => {
        const docRef = doc(db, "garages", garageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const availabilities = docSnap.data().availabilities || [];
          const selectedDateAvailability = availabilities.find(
            (avail) => avail.date === selectedDay.dateString
          );
          setAvailableSlots(
            selectedDateAvailability ? selectedDateAvailability.slots : []
          );
        }
      };
      fetchAvailableSlots();
    }
  }, [garageId, selectedDay]);

  const handleConfirm = () => {
    if (!selectedDay || !selectedTime) {
      Alert.alert("Veuillez sélectionner une date et une heure");
      return;
    }
    const dateTime = `${selectedDay.dateString} ${selectedTime}`;
    onConfirm(dateTime);
    onClose();
  };

  const handleOverlayPress = () => {
    onClose();
  };

  // Formatte la date au format YYYY-MM-DD pour la comparaison
  const getDateString = (date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={tw`flex-1 justify-center items-center`}>
        <BlurView intensity={100} style={tw`absolute inset-0`}>
          <TouchableOpacity
            style={tw`absolute inset-0`}
            onPress={handleOverlayPress}
          ></TouchableOpacity>
        </BlurView>
        <View style={tw`bg-white rounded-xl p-4 shadow-lg w-80`}>
          <TouchableOpacity onPress={onClose} style={tw`absolute top-2 left-2`}>
            <Text style={tw`text-black text-xl font-bold`}> ✕</Text>
          </TouchableOpacity>
          <Calendar
            style={tw`mt-5`}
            onDayPress={setSelectedDay}
            markedDates={{
              [selectedDay.dateString]: {
                selected: true,
                selectedColor: "#34469C",
              },
            }}
            minDate={getDateString(new Date())}
          />
          <View style={tw`mb-4 border border-gray-300 rounded-xl`}>
            <Picker
              selectedValue={selectedTime}
              onValueChange={(itemValue) => setSelectedTime(itemValue)}
            >
              {availableSlots.map((time, index) => (
                <Picker.Item key={index} label={time} value={time} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            onPress={handleConfirm}
            style={tw`bg-[#34469C] p-2 rounded-md w-full items-center mb-2`}
          >
            <Text style={tw`text-white font-semibold text-base`}>Valider</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DateTimePickerModal;
