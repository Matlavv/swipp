import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import tw from 'twrnc';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

// data des boutons
const data = [
  {
    id: "123",
    title: "Energies",
    image: "https://images.hertz.com/icons/GasIcon.png",
    screen: "energyScreen",
  },
  {
    id: "456",
    title: "Entretiens",
    image: "https://cdn.icon-icons.com/icons2/3469/PNG/512/ev_repair_vehicle_car_electric_maintenance_icon_219812.png",
    screen: "maintenanceScreen",
  },
];

const data2 = [
  {
    id: "789",
    title: "Services",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen",
  },
  {
    id: "1011",
    title: "Données",
    image: "https://links.papareact.com/28w",
    screen: "EatsScreen",
  },
];


const NavOptions = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View>
        {/* Première rangée de boutons */}
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item.screen)}
              style={tw`p-3 pl-6 pb-8 pt-4 bg-gray-200 m-3 mt-10 rounded-lg`}
            >
              <View>
                <Image
                  style={{ width: 120, height: 120, resizeMode: 'contain' }}
                  source={{ uri: item.image }}
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
        {/* Deuxième rangée de boutons */}
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
                <Image
                  style={{ width: 120, height: 120, resizeMode: 'contain' }}
                  source={{ uri: item.image }}
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
