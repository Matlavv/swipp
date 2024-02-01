import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "twrnc";

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

const DateTimePickerModal = ({ isVisible, onClose, onConfirm }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);

  useEffect(() => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    let startHour = 10;

    if (selectedDay.dateString === getDateString(currentTime)) {
      // Si c'est le jour actuel, définir le début à l'heure actuelle + 1 heure
      startHour = currentMinutes > 30 ? currentHour + 2 : currentHour + 1;
    }

    const newTimeSlots = generateTimeSlots(startHour);
    setTimeSlots(newTimeSlots);
    setSelectedTime(newTimeSlots[0]);
  }, [selectedDay]);

  const handleConfirm = () => {
    if (!selectedDay) {
      Alert.alert("Veuillez sélectionner une date");
      return;
    }
    const dateTime = `${selectedDay.dateString} ${selectedTime}`;
    onConfirm(dateTime);
    Alert.alert(
      "Rendez-vous validé !",
      `Votre rendez-vous est validé le : ${dateTime}`
    );
    onClose();
  };

  // Formatte la date au format YYYY-MM-DD pour la comparaison
  const getDateString = (date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={tw`m-4 bg-white rounded-xl p-4 shadow-lg`}>
        <TouchableOpacity onPress={onClose} style={tw`absolute top-2 left-1`}>
          <Text style={tw`text-black text-xl font-bold`}>✕</Text>
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
        <Picker
          selectedValue={selectedTime}
          onValueChange={(itemValue) => setSelectedTime(itemValue)}
          style={tw`mb-4`}
        >
          {timeSlots.map((time, index) => (
            <Picker.Item key={index} label={time} value={time} />
          ))}
        </Picker>
        <TouchableOpacity
          onPress={handleConfirm}
          style={tw`bg-[#34469C] p-2 rounded-md w-full items-center mb-2`}
        >
          <Text style={tw`text-white font-semibold text-base`}>Valider</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default DateTimePickerModal;
