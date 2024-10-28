// Importation des modules nécessaires depuis React Native et Firebase
import { Ionicons } from "@expo/vector-icons"; // Icônes Ionicons
import { useNavigation } from "@react-navigation/native"; // Navigation
import * as ImagePicker from "expo-image-picker"; // Sélecteur d'images
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Gestion de Firestore
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Gestion du stockage Firebase
import React, { useEffect, useState } from "react"; // Gestion de l'état et des effets
import {
  Image, // Affichage des images
  SafeAreaView, // Zone de contenu
  ScrollView, // Liste scrollable
  Text, // Texte
  TouchableOpacity, // Bouton cliquable
  View, // Conteneur de composants
} from "react-native"; // Composants de base React Native
import tw from "twrnc"; // Utilisation de Tailwind CSS pour les styles
import { background1, background3 } from "../../assets"; // Importation des images de fond
import SettingsList from "../../components/SettingsList"; // Composant personnalisé pour les options de réglage
import { auth, db, signOut } from "../../firebaseConfig"; // Firebase config

// Composant de l'écran utilisateur
const UserScreen = () => {
  // Gestion de la navigation entre les écrans
  const navigation = useNavigation();

  // États pour les informations utilisateur
  const [username, setUsername] = useState(""); // Nom d'utilisateur
  const [profileImage, setProfileImage] = useState(null); // Image de profil
  const [role, setRole] = useState(""); // Rôle de l'utilisateur
  const user = auth.currentUser; // Récupération de l'utilisateur actuel

  // Fonctions de navigation vers d'autres écrans
  const navigateToUserScreen = () => navigation.navigate("UserProfileScreen");
  const navigateToAdressScreen = () => navigation.navigate("AdressScreen");
  const navigateToCarScreen = () => navigation.navigate("VehicleScreen");
  const navigateToLegalScreen = () => navigation.navigate("LegalScreen");
  const navigateToAboutScreen = () => navigation.navigate("AboutScreen");
  const navigateToRefuelAdminScreen = () => navigation.navigate("RefuelAdmin");
  const navigateToRefuelInfosScreen = () => navigation.navigate("RefuelInfos");

  // Fonction pour se déconnecter
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Déconnexion via Firebase
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  // Fonction pour téléverser une image de profil vers Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage(); // Accès au stockage Firebase
    const storageRef = ref(storage, `profileImages/${user.uid}`); // Référence du chemin de l'image

    try {
      const snapshot = await uploadBytes(storageRef, blob); // Téléversement de l'image
      const downloadURL = await getDownloadURL(snapshot.ref); // Récupération de l'URL de l'image
      updateUserProfile(downloadURL); // Mise à jour du profil utilisateur avec la nouvelle URL
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image", error);
    }
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateUserProfile = async (imageUrl) => {
    const userDocRef = doc(db, "users", user.uid); // Référence au document utilisateur
    try {
      await updateDoc(userDocRef, { profileImageUrl: imageUrl }); // Mise à jour de l'image de profil
      setProfileImage({ uri: imageUrl }); // Mise à jour de l'état local pour l'affichage de l'image
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
    }
  };

  // Fonction pour ouvrir le sélecteur d'images
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Limite la sélection aux images
      allowsEditing: true, // Permet l'édition de l'image
      aspect: [1, 1], // Ratio 1:1 pour l'image
      quality: 1, // Qualité maximale
    });

    if (!result.canceled && result.assets) {
      uploadImage(result.assets[0].uri); // Téléversement de l'image sélectionnée
    }
  };

  // Chargement des données utilisateur au chargement du composant
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username); // Mise à jour du nom d'utilisateur
          const imageUrl = docSnap.data().profileImageUrl;
          setProfileImage({ uri: imageUrl }); // Mise à jour de l'image de profil
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Récupération du rôle utilisateur
  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      getDoc(userDoc).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setRole(docSnapshot.data().role); // Mise à jour du rôle utilisateur
        }
      });
    }
  }, [user]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`items-center`}>
        {/* Affichage de la zone de profil avec une image de fond */}
        <View style={tw`w-full`}>
          <Image
            source={background1}
            style={[tw`w-full mt-5 absolute`, { height: 310 }]} // Image de fond
            resizeMode="stretch"
          />
          <Image
            source={background3}
            style={[tw`w-5/6 absolute`, { marginTop: 100, height: 230 }]} // Image supplémentaire
            resizeMode="stretch"
          />
          <View style={tw`w-full items-center absolute`}>
            {/* Zone de l'image de profil */}
            <View
              style={tw`w-130 bg-white p-4 rounded-b-3xl items-center rounded-b-[190px]`}
            >
              <View style={tw`p-2 bg-white mt-15 relative`}>
                <Image
                  source={profileImage}
                  style={tw`h-28 w-28 rounded-full`} // Affichage de l'image de profil
                />

                <TouchableOpacity
                  onPress={pickImage}
                  style={tw`absolute bottom-0 right-0 bg-[#34469C] p-2 rounded-full`} // Bouton pour changer l'image de profil
                >
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={tw`text-xl font-bold text-black mt-4`}>
                {username || "Chargement..."} {/* Affichage du nom d'utilisateur */}
              </Text>
            </View>
          </View>
        </View>

        {/* Liste des paramètres et options */}
        <View style={tw`mt-80 w-5/6`}>
          <Text style={tw`m-4 font-bold text-xl`}>Compte</Text>
          <View style={tw`mb-2`}>
            <SettingsList
              onPress={navigateToUserScreen}
              iconName="person"
              text="Gérer mon compte"
            />
          </View>
          <View style={tw`mb-2`}>
            <SettingsList
              onPress={navigateToAdressScreen}
              iconName="home"
              text="Mes adresses"
            />
          </View>
          <SettingsList
            onPress={navigateToCarScreen}
            iconName="car"
            text="Mes véhicules"
          />
        </View>
        <View style={tw`w-5/6`}>
          <Text style={tw`m-4 font-bold text-xl`}>Autres</Text>
          <View style={tw`mb-2`}>
            {role === "refueler" && (
              <SettingsList
                onPress={navigateToRefuelInfosScreen}
                iconName="person-circle-sharp"
                text="Refueler infos"
              />
            )}
          </View>
          <View style={tw`mb-2`}>
            {role === "refueler" && (
              <SettingsList
                onPress={navigateToRefuelAdminScreen}
                iconName="person-circle-sharp"
                text="Vue Admin"
              />
            )}
          </View>
          <View style={tw`mb-2`}>
            <SettingsList
              onPress={navigateToLegalScreen}
              iconName="bookmark"
              text="Mentions légales"
            />
          </View>
          <SettingsList
            onPress={navigateToAboutScreen}
            iconName="information-circle-sharp"
            text="A propos de Swipp"
          />
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={tw`p-3 bg-[#34469C] m-3 rounded-lg`}
        >
          <Text style={tw`text-white text-center text-lg shadow-2xl`}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScreen;
