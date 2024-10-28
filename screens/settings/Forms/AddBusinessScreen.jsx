import { Ionicons } from "@expo/vector-icons";
import {
  addDoc, // Fonction pour ajouter un document à Firestore
  collection, // Fonction pour accéder à une collection dans Firestore
  doc, // Fonction pour accéder à un document spécifique dans Firestore
  getDocs, // Fonction pour obtenir des documents depuis une collection
  updateDoc, // Fonction pour mettre à jour un document dans Firestore
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert, // Permet d'afficher des alertes sur l'écran
  Image, // Composant pour afficher des images
  ScrollView, // Permet de scroller les contenus plus longs que l'écran
  Text, // Composant pour afficher du texte
  TextInput, // Composant pour les champs de saisie de texte
  TouchableOpacity, // Boutons cliquables
  View, // Conteneur de base pour structurer les éléments
} from "react-native";
import tw from "twrnc"; // Librairie pour utiliser Tailwind CSS avec React Native
import { swippLogo } from "../../../assets"; // Logo de l'application
import { auth, db } from "../../../firebaseConfig"; // Importation de l'authentification et de la base de données Firestore

// Composant pour ajouter ou modifier une entreprise
const AddBusinessScreen = ({ navigation }) => {
  // États pour stocker les informations de l'entreprise
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessId, setBusinessId] = useState(null); // Utilisé pour savoir si l'entreprise existe déjà ou si c'est une nouvelle

  // useEffect pour récupérer les données de l'entreprise existante (s'il y en a une) lorsque l'utilisateur est connecté
  useEffect(() => {
    const fetchBusinessData = async () => {
      const user = auth.currentUser; // Obtenir l'utilisateur actuel
      if (user) {
        const querySnapshot = await getDocs(
          collection(db, "users", user.uid, "businesses") // Récupère les entreprises de l'utilisateur connecté
        );
        if (!querySnapshot.empty) {
          const businessData = querySnapshot.docs[0].data(); // Récupère la première entreprise si elle existe
          setBusinessId(querySnapshot.docs[0].id); // Stocke l'ID de l'entreprise pour une éventuelle mise à jour
          setBusinessName(businessData.businessName); // Remplit les champs avec les données de l'entreprise existante
          setBusinessAddress(businessData.businessAddress);
          setBusinessPhone(businessData.businessPhone);
        }
      }
    };

    fetchBusinessData(); // Appel de la fonction pour récupérer les données de l'entreprise
  }, []);

  // Fonction pour ajouter ou mettre à jour les informations de l'entreprise
  const handleAddOrUpdateBusiness = async () => {
    const user = auth.currentUser; // Obtenir l'utilisateur actuel
    if (user) {
      try {
        const businessData = {
          businessName,
          businessAddress,
          businessPhone,
          // Ajout d'autres champs ici si nécessaire
        };

        if (businessId) {
          // Si une entreprise existe déjà, on met à jour les informations
          await updateDoc(
            doc(db, "users", user.uid, "businesses", businessId), // Mise à jour de l'entreprise dans Firestore
            businessData
          );
          Alert.alert("Business Updated!"); // Alerte pour indiquer que l'entreprise a été mise à jour
        } else {
          // Si aucune entreprise n'existe, on en ajoute une nouvelle
          await addDoc(
            collection(db, "users", user.uid, "businesses"), // Ajout de la nouvelle entreprise dans Firestore
            businessData
          );
          Alert.alert("Votre entreprise a été ajoutée !"); // Alerte pour indiquer que l'entreprise a été ajoutée
        }
      } catch (error) {
        console.error("Error adding/updating business", error); // Affichage de l'erreur en cas de problème
      }
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}> {/* ScrollView pour permettre de scroller la page */}
      {/* Affichage du logo de l'application */}
      <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
        <Image style={tw`w-60 h-30`} source={swippLogo} />
      </View>

      {/* Titre de la page et bouton de retour */}
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Retour à la page précédente
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Ajouter votre entreprise</Text>
      </View>

      {/* Formulaire pour ajouter ou mettre à jour les informations de l'entreprise */}
      <View style={tw`p-4`}>
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Nom de l'entreprise" // Champ pour le nom de l'entreprise
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Adresse de l'entreprise" // Champ pour l'adresse de l'entreprise
          value={businessAddress}
          onChangeText={setBusinessAddress}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Numéro de téléphone" // Champ pour le numéro de téléphone de l'entreprise
          value={businessPhone}
          onChangeText={setBusinessPhone}
        />

        {/* Bouton pour soumettre le formulaire */}
        <View style={tw`flex items-center`}>
          <TouchableOpacity
            title="Mon entreprise"
            onPress={handleAddOrUpdateBusiness} // Appelle la fonction pour ajouter ou mettre à jour l'entreprise
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Ajouter mon entreprise</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddBusinessScreen;
