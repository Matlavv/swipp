import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { background1, background3, profilePic } from "../../assets";
import SettingsList from "../../components/SettingsList";
import { auth, db, signOut } from "../../firebaseConfig";

const UserScreen = () => {
  const navigation = useNavigation();

  const navigateToUserScreen = () => {
    navigation.navigate("UserProfileScreen");
  };

  const navigateToAdressScreen = () => {
    navigation.navigate("AdressScreen");
  };

  const navigateToCarScreen = () => {
    navigation.navigate("VehicleScreen");
  };

  const navigateToLegalScreen = () => {
    navigation.navigate("LegalScreen");
  };

  const navigateToAboutScreen = () => {
    navigation.navigate("AboutScreen");
  };

  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Vous pouvez naviguer vers l'écran de connexion ou effectuer d'autres actions ici après la déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);

    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      updateUserProfile(downloadURL);
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image", error);
    }
  };

  const updateUserProfile = async (imageUrl) => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        profileImageUrl: imageUrl,
      });
      setProfileImage(imageUrl);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      uploadImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
          // Ajoutez ceci pour récupérer l'URL de la photo de profil
          const profileImageUrl = docSnap.data().profileImageUrl || profilePic;
          setProfileImage(profileImageUrl);
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`flex-1 items-center`}>
        {/* Zone de profil avec image de fond */}
        <View style={tw`w-full`}>
          <Image
            source={background1}
            style={[tw`w-full mt-5 absolute`, { height: 310 }]}
            resizeMode="stretch"
          />
          <Image
            source={background3}
            style={[tw`w-5/6 absolute`, { marginTop: 100, height: 230 }]}
            resizeMode="stretch"
          />
          <View style={tw`w-full items-center absolute`}>
            {/* Zone blanche arrondie pour le profil */}

            <View
              style={tw`w-130 bg-white p-4 rounded-b-3xl items-center rounded-b-[190px]`}
            >
              <View style={tw`p-2 bg-white mt-15 relative`}>
                <Image
                  source={profileImage ? { uri: profileImage } : profilePic}
                  style={tw`h-24 w-24 rounded-full`}
                />
                <TouchableOpacity
                  onPress={pickImage}
                  style={tw`absolute bottom-0 right-0 bg-[#34469C] p-2 rounded-full`}
                >
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={tw`text-xl font-bold text-black mt-4`}>
                {username || "Chargement..."}
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`mt-80 w-5/6`}>
          <Text style={tw`m-4 font-bold text-xl`}>Compte</Text>
          <SettingsList
            onPress={navigateToUserScreen}
            iconName="person"
            text="Gérer mon compte"
          />
          <SettingsList
            onPress={navigateToAdressScreen}
            iconName="home"
            text="Mes adresses"
          />
          <SettingsList
            onPress={navigateToCarScreen}
            iconName="car"
            text="Mes voitures"
          />
        </View>
        <View style={tw`w-5/6`}>
          <Text style={tw`m-4 font-bold text-xl`}>Autres</Text>
          <SettingsList
            onPress={navigateToLegalScreen}
            iconName="bookmark"
            text="Mentions légales"
          />
          <SettingsList
            onPress={navigateToAboutScreen}
            iconName="information-circle-sharp"
            text="A propos de Swipp"
          />
        </View>
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
