import {
  createUserWithEmailAndPassword, // Fonction pour créer un utilisateur avec email et mot de passe
  sendEmailVerification, // Fonction pour envoyer un email de vérification
} from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore"; // Pour gérer les documents Firestore et le timestamp
import React, { useState } from "react"; // Utilisation de React et du hook useState pour gérer les états
import {
  Alert, // Pour afficher des alertes natives
  Image, // Pour afficher des images
  SafeAreaView, // Composant pour délimiter une zone sécurisée
  ScrollView, // Composant pour permettre le défilement du contenu
  Text, // Composant pour afficher du texte
  TextInput, // Composant pour les champs de saisie de texte
  TouchableOpacity, // Composant pour les boutons cliquables
  View, // Conteneur pour structurer les composants
} from "react-native";
import tw from "twrnc"; // Utilisation de la bibliothèque Tailwind pour les styles
import { swippLogo } from "../../assets"; // Importation du logo de l'application
import { auth, db } from "../../firebaseConfig"; // Importation de l'authentification et de Firestore

// Composant principal pour l'écran d'inscription
const SignUpScreen = ({ navigation }) => {
  // États pour stocker les valeurs des champs de saisie
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fonction pour valider les champs d'entrée avant la création de compte
  const validateInputs = () => {
    if (email.length === 0 || !email.includes("@")) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return false;
    }

    // Vérification de la complexité du mot de passe
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères, incluant au moins un chiffre et une majuscule."
      );
      return false;
    }

    // Vérification des autres champs
    if (username.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer un nom d'utilisateur.");
      return false;
    }
    if (firstName.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer votre prénom.");
      return false;
    }
    if (lastName.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer votre nom.");
      return false;
    }

    // Vérification du format du numéro de téléphone
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Erreur", "Veuillez entrer un numéro de téléphone valide.");
      return false;
    }

    return true; // Retourne vrai si tous les champs sont valides
  };

  // Fonction pour gérer l'inscription de l'utilisateur
  const handleSignUp = async () => {
    if (!validateInputs()) return; // Si les champs ne sont pas valides, on arrête la fonction

    try {
      // Création de l'utilisateur avec Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Envoi d'un email de vérification
      await sendEmailVerification(user);

      // Image par défaut pour le profil utilisateur
      const defaultProfileImgUrl =
        "https://firebasestorage.googleapis.com/v0/b/swipp-b74be.appspot.com/o/profileImages%2FprofilePic.png?alt=media&token=34edfdcb-9114-45a4-b84f-bd9a22f92c57";

      // Ajout des informations de l'utilisateur dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        firstName,
        lastName,
        phoneNumber,
        createdAt: Timestamp.now(), // Enregistrement de la date de création
        profileImageUrl: defaultProfileImgUrl, // Image de profil par défaut
        role: "user", // Défini le rôle de l'utilisateur
      });

      // Redirection vers l'écran de connexion
      navigation.navigate("LoginScreen");
      Alert.alert(
        "Vérification de l'email",
        "Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception."
      );
    } catch (error) {
      // Gestion des erreurs lors de l'inscription
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Inscription impossible", "Erreur lors de l'inscription");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Email invalide", "L'adresse email est invalide.");
      } else {
        Alert.alert("Erreur", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={tw`flex h-full`}> {/* Utilisation de SafeAreaView pour éviter le chevauchement avec la barre de statut */}
      <ScrollView style={tw`flex-1`}>
        {/* Affichage du logo de l'application */}
        <View style={tw`p-5 mt-5 items-center justify-center flex-row`}>
          <Image style={tw`w-60 h-30`} source={swippLogo} />
        </View>

        {/* Titre de la page */}
        <Text style={tw`text-xl font-bold m-5 mt-10`}>Créez votre compte</Text>

        {/* Formulaire pour l'inscription */}
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Email" // Champ pour l'email
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Mot de passe" // Champ pour le mot de passe
            autoCapitalize="none"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Nom d'utilisateur" // Champ pour le nom d'utilisateur
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Prénom" // Champ pour le prénom
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Nom" // Champ pour le nom
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`}
            placeholder="Numéro de téléphone" // Champ pour le numéro de téléphone
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {/* Bouton pour s'inscrire */}
          <TouchableOpacity
            onPress={handleSignUp} // Appelle la fonction d'inscription
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7 shadow-2xl`}
          >
            <Text style={tw`text-white text-base`}>S'inscrire</Text>
          </TouchableOpacity>

          {/* Lien pour se connecter si l'utilisateur a déjà un compte */}
          <View style={tw`flex-row justify-center items-center mt-8`}>
            <Text style={tw`text-black font-semibold text-sm`}>
              Vous avez deja un compte ?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")} // Redirection vers la page de connexion
            >
              <Text style={tw`text-blue-500 ml-2 font-bold text-sm`}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
