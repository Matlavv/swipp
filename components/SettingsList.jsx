import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const SettingsList = ({ iconName, text, onPress }) => {
  return (
    <TouchableOpacity
      style={tw`flex-row items-center bg-gray-200 px-4 py-2 rounded-xl mx-2`}
      onPress={onPress}
    >
      <View style={tw`w-12 h-12 items-center justify-center mr-4`}>
        <Ionicons name={iconName} size={24} color="#34469C" />
      </View>
      <View style={tw`flex-1 ml-2`}>
        <Text style={tw`text-lg font-semibold text-black`}>{text}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#34469C" />
    </TouchableOpacity>
    // <TouchableOpacity
    //   onPress={onPress}
    //   style={tw`flex-row rounded-xl p-3 px-4 bg-gray-200`}
    // >
    //   <Ionicons style={tw``} name={iconName} color={"#34469C"} size={20} />
    //   <Text style={tw`ml-10 font-semibold text-base flex`}>{text}</Text>
    //   <Ionicons
    //     style={tw`ml-10`}
    //     name="chevron-forward-outline"
    //     color={"#34469C"}
    //     size={20}
    //   />
    // </TouchableOpacity>
  );
};
export default SettingsList;
