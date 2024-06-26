import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const SettingsList = ({ iconName, text, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={tw`m-4 flex-row mr-15 justify-start`}>
        <Ionicons 
          style={tw`ml-9`}
          name={iconName}
          size={20}
        />
        <Text style={tw`ml-5 text-base flex`}>{text}</Text>
      </TouchableOpacity>
    );
  }
export default SettingsList;
