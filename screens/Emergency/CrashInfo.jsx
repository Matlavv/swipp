import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { swippLogo } from "../../assets";

const CrashInfo = () => {
  const navigation = useNavigation();

  const emergencyNumbers = [
    { name: "Police Secours", number: "17" },
    { name: "Pompiers", number: "18" },
    { name: "SAMU", number: "15" },
    { name: "Numéro d'urgence européen", number: "112" },
    { name: "Allianz", number: "0 978 978 000" },
    { name: "ASSU 2000", number: "01 48 10 15 00" },
    { name: "Axa", number: "01 55 92 26 92" },
    { name: "Banque Populaire", number: "0 980 986 986" },
    { name: "BNP Paribas", number: "01 55 92 26 64" },
    { name: "Caisse d'épargne", number: "09 69 36 45 45" },
    { name: "Crédit Agricole", number: "09 69 39 92 91" },
    { name: "Crédit Mutuel", number: "03 88 40 10 00" },
    { name: "Direct Assurance", number: "01 55 92 27 20" },
    { name: "Euro Assurance", number: "01 49 15 74 00" },
    { name: "Gan", number: "01 70 94 21 02" },
    { name: "Generali", number: "01 58 38 40 00" },
    { name: "Banque Postale", number: "02 28 09 42 00" },
    { name: "Société Générale", number: "01 40 25 50 01" },
    { name: "GMF", number: "08 00 00 12 13" },
    { name: "Groupama", number: "01 45 16 66 66" },
    { name: "MAAF", number: "0 800 16 17 18" },
    { name: "MACIF", number: "09 69 39 49 49" },
    { name: "Matmut", number: "02 35 03 68 68" },
    { name: "MMA", number: "09 809 809 11" },
    { name: "MAIF", number: "0 800 875 875" },
  ];

  const makeCall = (number) => {
    console.log(`Tentative d'appel du numéro: ${number}`);
    const phoneNumber =
      Platform.OS === "android" ? `tel:${number}` : `telprompt:${number}`;
    console.log(`Ouverture de l'URL: ${phoneNumber}`);
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          console.log("Numéro non supporté");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={tw`flex h-full`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex p-5 mt-5 justify-start items-start flex-row`}>
          <Image style={tw`w-25 h-15`} source={swippLogo} />
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mt-5 ml-3`}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold m-5`}>Indiquer un accident</Text>
        </View>
        {/* Ici, nous affichons les numéros d'urgence */}
        <Text style={tw`text-xl font-bold m-5`}>Numéros d'urgence :</Text>
        {emergencyNumbers.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => makeCall(item.number)}
            style={tw`mb-3 ml-3`}
          >
            <View style={tw`flex-row`}>
              <Text style={tw`text-lg`}>{item.name} : </Text>
              <Text style={tw`font-bold text-lg`}>{item.number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CrashInfo;
