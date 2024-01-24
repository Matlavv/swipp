import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, View } from "react-native";
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
    Alert.alert("Rendez-vous validé", `Date et heure: ${dateTime}`);
    onClose();
  };

  // Formatte la date au format YYYY-MM-DD pour la comparaison
  const getDateString = (date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={tw`m-4 bg-white rounded-lg p-4 shadow-lg`}>
        <Calendar
          onDayPress={setSelectedDay}
          markedDates={{
            [selectedDay.dateString]: { selected: true, selectedColor: "blue" },
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
        <Button title="Valider" onPress={handleConfirm} />
        <Button title="Fermer" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default DateTimePickerModal;
