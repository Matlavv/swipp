import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

const ChooseTimeModal = ({ isVisible, onTimeSelect, onClose, times }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center`}>
        <View style={tw`bg-white p-5 rounded-lg w-80`}>
          <ScrollView>
            {times.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={tw`bg-gray-200 p-2 rounded-md mb-2`}
                onPress={() => onTimeSelect(time)}
              >
                <Text>{time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={tw`bg-black p-2 rounded-md w-full items-center mt-4`}
          >
            <Text style={tw`text-white`}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseTimeModal;
