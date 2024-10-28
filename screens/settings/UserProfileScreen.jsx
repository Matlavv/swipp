import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Fonction à utiliser lors de l'appel d'informations
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
import tw from "twrnc"; // Librairie pour Tailwind CSS
import { swippLogo } from "../../assets";
import { auth, db } from "../../firebaseConfig";

// Composant principal de l'écran de profil utilisateur
const UserProfileScreen = ({ navigation }) => {
  // Déclarations des états locaux pour stocker les informations de l'utilisateur
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // Pour afficher ou cacher la modal du changement de mot de passe
  var errorform = false; // Variable pour indiquer si le formulaire contient des erreurs

  // useEffect qui s'exécute lors du premier rendu pour récupérer les données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid); // Récupère la référence au document de l'utilisateur dans Firestore
        const docSnap = await getDoc(docRef); // Récupère les données de l'utilisateur
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Mise à jour des états avec les données récupérées
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

  // Fonction pour confirmer la mise à jour des informations utilisateur
  const confirmUpdate = () => {
    errorform = false;
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

  // Fonction pour gérer la mise à jour des informations utilisateur
  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Vérification si tous les champs sont remplis
        if (!username || !firstName || !lastName || !email || !phoneNumber) {
          Alert.alert("Erreur", "Tous les champs doivent être remplis");
          errorform = true;
        }

        if (errorform == false) {
          // Mise à jour de l'email de l'utilisateur
          await updateEmail(user, email)
            .then(() => {
              Alert.alert("Profil et e-mail mis à jour avec succès !");
            })
            .catch((error) => {
              // Gestion des erreurs lors de la mise à jour de l'email
              if (error.code === "auth/email-already-in-use") {
                Alert.alert(
                  "Erreur",
                  "Impossible d'enregistrer cette adresse mail."
                );
                errorform = true;
              } else if (error.code === "auth/invalid-email") {
                Alert.alert("Erreur", "Enregistrer une adresse mail correcte.");
                errorform = true;
              } else if (error.code === "auth/requires-recent-login") {
                // Si une reconnexion est nécessaire
                Alert.alert(
                  "Reconnexion requise",
                  "Pour des raisons de sécurité, cette opération nécessite une authentification récente. Veuillez vous déconnecter puis vous reconnecter avant de réessayer.",
                  [
                    {
                      text: "Annuler",
                      onPress: () => console.log("Mise à jour annulée"),
                      style: "cancel",
                    },
                    { text: "Confirmer", onPress: () => handleReconnect() },
                  ]
                );
                errorform = true;
              } else {
                Alert.alert(
                  "Erreur lors de la mise à jour de l'e-mail",
                  error.message
                );
                errorform = true;
              }
            });
        }

        // Mise à jour des autres informations de l'utilisateur dans Firestore
        if (errorform == false) {
          await updateDoc(doc(db, "users", user.uid), {
            username,
            firstName,
            lastName,
            email,
            phoneNumber,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      Alert.alert("Erreur lors de la mise à jour du profil", error.message);
    }
  };

  // Fonction pour gérer la reconnexion de l'utilisateur
  const handleReconnect = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Redirection vers l'écran de connexion après déconnexion
        navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion", error);
      });
  };

  // Fonction pour valider le nouveau mot de passe
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

  // Fonction pour gérer la mise à jour du mot de passe
  const handleUpdatePassword = async () => {
    if (!validatePassword(newPassword)) {
      return; // Arrête si le mot de passe n'est pas valide
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
      if (error.code === "auth/requires-recent-login") {
        // Si une reconnexion est nécessaire pour la mise à jour du mot de passe
        Alert.alert(
          "Reconnexion requise",
          "Pour des raisons de sécurité, cette opération nécessite une authentification récente. Veuillez vous déconnecter puis vous reconnecter avant de réessayer.",
          [
            {
              text: "Annuler",
              onPress: () => console.log("Mise à jour annulée"),
              style: "cancel",
            },
            {
              text: "Confirmer",
              onPress: () => handleReconnect(),
            },
          ]
        );
      } else {
        // Gestion des autres erreurs
        console.error("Erreur lors de la mise à jour du mot de passe", error);
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer."
        );
      }
    }
  };

  // Fonction pour afficher la modal de changement de mot de passe
  const openModal = () => {
    setShowModal(true);
  };

  // Fonction pour rediriger vers l'écran d'ajout d'entreprise
  const navigateToAddBusiness = () => {
    navigation.navigate("AddBusinessScreen");
  };

  // Fonction pour valider et formater le numéro de téléphone (autorise seulement les chiffres)
  const handlePhoneNumberChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, ""); // N'accepte que les chiffres
    if (numericText.length <= 10) {
      setPhoneNumber(numericText);
    }
  };

  return (
    <ScrollView style={tw`flex-1 mt-5`}>
      {/* Affichage du logo Swipp */}
      <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
        <Image style={tw`w-60 h-30`} source={swippLogo} />
      </View>

      {/* Bouton retour et titre de la page */}
      <View style={tw`flex-row`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-5 ml-3`}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color="gray" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold m-5`}>Modifier votre profil</Text>
      </View>

      {/* Formulaire de modification du profil */}
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

        {/* Boutons de mise à jour et de modification */}
        <View style={tw`flex items-center`}>
          <TouchableOpacity
            onPress={confirmUpdate}
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Mettre à jour le profil</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            title="Mon entreprise"
            onPress={navigateToAddBusiness}
            style={tw`bg-[#34469C] px-4 py-3 rounded-full flex mt-7`}
          >
            <Text style={tw`text-white text-sm`}>Ajouter mon entreprise</Text>
          </TouchableOpacity> */}

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

      {/* Modal pour le changement de mot de passe */}
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
