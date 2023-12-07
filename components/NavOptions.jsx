import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const data = [
 {
   id: "123",
   title: "Energies",
   icon: "local-gas-station", 
   type: "MaterialIcons",
   screen: "energyScreen",
 },
 {
   id: "456",
   title: "Entretiens",
   icon: "car-repair", 
   type : "MaterialIcons",
   screen: "maintenanceScreen",
 },
];

const data2 = [
 {
   id: "789",
   title: "Services",
   icon: "local-gas-station", 
   type: "MaterialIcons",
   screen: "MapScreen",
 },
 {
   id: "1011",
   title: "Données",
   icon: "local-gas-station", 
   type: "MaterialIcons",
   screen: "EatsScreen",
 },
];

const NavOptions = () => {
 const navigation = useNavigation();

 return (
   <View>
     <View>
       {/* First Button row*/}
       <FlatList
         data={data}
         horizontal
         keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
           <TouchableOpacity
             onPress={() => navigation.navigate(item.screen)}
             style={tw`p-3 pl-6 pb-8 bg-gray-200 m-3 mt-10 rounded-lg`}
           >
             <View>
               <Icon
                style={tw`w-25 h-25`}
                name={item.icon}
                type={item.type}
                color="black"
               />
               <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
               <Icon
                style={tw`p-2 bg-black rounded-full w-10 mt-4`}
                name="arrowright"
                type="antdesign"
                color="white"
               />
             </View>
           </TouchableOpacity>
         )}
       />
     </View>

     <View>
       {/* Second Button row */}
       <FlatList
         data={data2}
         horizontal
         keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
           <TouchableOpacity
             onPress={() => navigation.navigate(item.screen)}
             style={tw`p-3 pl-6 pb-8 pt-4 bg-gray-200 m-3 mt-4 rounded-lg`}
           >
             <View>
               <Icon 
                style={tw`w-25 h-25`}
                name={item.icon}
                type={item.type}
                color="black"
               />
               <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
               <Icon
                style={tw`p-2 bg-black rounded-full w-10 mt-4`}
                name="arrowright"
                type="antdesign"
                color="white"
               />
             </View>
           </TouchableOpacity>
         )}
       />
     </View>
   </View> 
 );
};

export default NavOptions;
