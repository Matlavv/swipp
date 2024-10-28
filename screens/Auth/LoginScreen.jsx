import {
  sendPasswordResetEmail, // Fonction pour envoyer un email de réinitialisation du mot de passe
  signInWithEmailAndPassword, // Fonction pour gérer la connexion avec email et mot de passe
} from "firebase/auth";
import React, { useState } from "react"; // Hook useState pour la gestion des états
import {
  Alert, // Permet d'afficher des alertes natives
  Image, // Composant pour afficher des images
  SafeAreaView, // Composant pour éviter le chevauchement des barres de statut
  ScrollView, // Permet de scroller le contenu plus grand que l'écran
  Text, // Composant pour afficher du texte
  TextInput, // Composant pour les champs de saisie de texte
  TouchableOpacity, // Composant pour les boutons cliquables
  View, // Conteneur pour structurer les composants
} from "react-native";
import tw from "twrnc"; // Librairie pour utiliser Tailwind CSS dans React Native
import { swippLogo } from "../../assets"; // Importation du logo
import { auth } from "../../firebaseConfig"; // Importation de Firebase Auth

// Composant pour l'écran de connexion
const LoginScreen = ({ navigation }) => {
  // États pour stocker les valeurs des champs email et mot de passe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fonction pour valider les champs d'entrée avant la connexion
  const validateInputs = () => {
    // Vérification de l'email
    if (email.length === 0 || !email.includes("@")) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return false;
    }
    // Vérification du mot de passe
    if (password.length === 0) {
      Alert.alert("Erreur", "Veuillez entrer un mot de passe.");
      return false;
    }
    return true; // Retourne vrai si les champs sont valides
  };

  // Fonction pour gérer la connexion de l'utilisateur
  const handleLogin = async () => {
    // Si les champs ne sont pas valides, la fonction s'arrête
    if (!validateInputs()) return;

    try {
      // Tentative de connexion avec Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // Si la connexion est réussie, redirection vers l'écran utilisateur
      navigation.navigate("UserScreen");
    } catch (error) {
      // Gestion des erreurs de connexion
      if (
        error.code === "auth/user-not-found" || // Si l'utilisateur n'existe pas
        error.code === "auth/wrong-password" // Si le mot de passe est incorrect
      ) {
        Alert.alert("Identifiants incorrects", "Email ou mot de passe incorrect.");
      } else {
        Alert.alert("Erreur", error.message); // Affiche l'erreur si c'est un autre problème
      }
    }
  };

  // Fonction pour gérer la réinitialisation du mot de passe
  const handlePasswordReset = async () => {
    // Vérification que l'email est fourni et valide
    if (email.length === 0 || !email.includes("@")) {
      Alert.alert(
        "Erreur",
        "Veuillez fournir une adresse email valide pour réinitialiser votre mot de passe."
      );
    } else {
      try {
        // Envoi de l'email de réinitialisation avec Firebase
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          "Réinitialisation du mot de passe",
          "Un email de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte de réception."
        );
      } catch (error) {
        // Gestion des erreurs lors de l'envoi de l'email de réinitialisation
        Alert.alert(
          "Erreur",
          "Une erreur est survenue lors de la réinitialisation du mot de passe."
        );
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
        <Text style={tw`text-xl font-bold m-5 mt-10`}>
          Connectez-vous à votre compte
        </Text>

        {/* Champs de saisie pour l'email et le mot de passe */}
        <View style={tw`p-4 flex-1 justify-center items-center mt-10`}>
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`} // Champ de saisie pour l'email
            placeholder="Email"
            autoCapitalize="none" // Désactiver la capitalisation automatique pour l'email
            value={email} // Valeur de l'état email
            onChangeText={setEmail} // Mise à jour de l'état email
          />
          <TextInput
            style={tw`border-b w-80 p-2 mb-4`} // Champ de saisie pour le mot de passe
            placeholder="Mot de passe"
            autoCapitalize="none" // Désactiver la capitalisation automatique pour le mot de passe
            secureTextEntry // Masquer le texte pour les champs de mot de passe
            value={password} // Valeur de l'état password
            onChangeText={setPassword} // Mise à jour de l'état password
          />

          {/* Bouton de connexion */}
          <TouchableOpacity
            onPress={handleLogin} // Appelle la fonction de connexion
            style={tw`bg-[#34469C] px-5 py-3 rounded-full flex mt-7 shadow-2xl`}
          >
            <Text style={tw`text-white text-base`}>Connexion</Text>
          </TouchableOpacity>

          {/* Lien pour s'inscrire */}
          <View style={tw`flex-row justify-center items-center mt-8`}>
            <Text style={tw`text-black font-semibold text-sm`}>
              Pas de compte ?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")} // Redirige vers l'écran d'inscription
            >
              <Text style={tw`text-blue-500 ml-2 font-bold text-sm`}>
                S'inscrire
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lien pour réinitialiser le mot de passe */}
          <View style={tw`flex justify-center items-center mt-8`}>
            <TouchableOpacity onPress={handlePasswordReset} style={tw`mt-5`}>
              <Text style={tw`text-blue-500 text-center font-bold text-sm`}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
