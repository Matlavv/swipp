import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

const UserProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setPhoneNumber(data.phoneNumber);
          setIsProfessional(data.isProfessional);
        }
      }
    };

    fetchUserData();
  }, []);

  const confirmUpdate = () => {
    Alert.alert(
      "Confirmer la mise à jour",
      "Êtes-vous sûr de vouloir modifier vos informations ?",
      [
        {
          text: "Annuler",
          onPress: () => console.log("Mise à jour annulée"),
          style: "cancel",
        },
        { text: "Confirmer", onPress: () => handleUpdateProfile() },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          username,
          firstName,
          lastName,
          email,
          phoneNumber,
        });

        await updateEmail(user, email)
          .then(() => {
            Alert.alert("Profil et e-mail mis à jour avec succès !");
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de l'e-mail", error);
            if (error.code === "auth/email-already-in-use") {
              Alert.alert(
                "Erreur",
                "Impossible d'enregistrer cette adresse mail."
              );
            } else if (error.code === "auth/requires-recent-login") {
              // Affiche une alerte demandant à l'utilisateur de se reconnecter
              Alert.alert(
                "Reconnexion requise",
                "Pour des raisons de sécurité, cette opération nécessite une authentification récente. Veuillez vous déconnecter puis vous reconnecter avant de réessayer.",
                [
                  // Option pour se déconnecter (et potentiellement rediriger vers un écran de connexion)
                  { text: "OK", onPress: () => handleReconnect() },
                ]
              );
            } else {
              Alert.alert(
                "Erreur lors de la mise à jour de l'e-mail",
                error.message
              );
            }
          });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      Alert.alert("Erreur lors de la mise à jour du profil", error.message);
    }
  };

  const handleReconnect = () => {
    // Ici, vous pouvez implémenter la logique de déconnexion
    // Par exemple, utiliser `signOut` de Firebase Auth, puis rediriger vers un écran de connexion
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Rediriger vers un écran de connexion
        navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion", error);
      });
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères, incluant au moins un chiffre et une majuscule."
      );
      return false;
    }
    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword(newPassword)) {
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        Alert.alert("Succès", "Votre mot de passe a été mis à jour.");
        setNewPassword("");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer."
      );
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const navigateToAddBusiness = () => {
    navigation.navigate("AddBusinessScreen");
  };

  const handlePhoneNumberChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, ""); // Allow only numbers
    if (numericText.length <= 10) {
      setPhoneNumber(numericText);
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
        <Image style={tw`w-60 h-30`} source={swippLogo} />
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Modifier votre profil</Text>
      </View>
      <View style={tw`p-4 flex-1 justify-center items-center`}>
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Pseudo"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Nom de famille"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={tw`border-b w-80 p-2 mb-4`}
          placeholder="Numéro de téléphone"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="numeric"
          maxLength={10}
        />
        <View style={tw`flex items-center`}>
          <TouchableOpacity
            onPress={confirmUpdate}
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Mettre à jour le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="Mon entreprise"
            onPress={navigateToAddBusiness}
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Ajouter mon entreprise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openModal("password")}
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>
              Modifier mon mot de passe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`m-20 bg-white p-5 rounded-lg shadow-lg`}>
            <Text>Nouveau mot de passe</Text>
            <TextInput
              style={tw`border-b w-full p-2 mb-4`}
              placeholder="Mot de passe"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
            />
            <View style={tw`flex-row justify-evenly`}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                }}
                style={tw`bg-gray-300 p-2 rounded-full`}
              >
                <Text>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleUpdatePassword();
                  setShowModal(false);
                }}
                style={tw`bg-[#34469C] p-2 rounded-full`}
              >
                <Text style={tw`text-white`}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default UserProfileScreen;
