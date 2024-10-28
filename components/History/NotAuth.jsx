import { Text } from "react-native"; // Importation du composant Text de React Native
import tw from "twrnc"; // Importation de la bibliothèque Tailwind CSS pour styliser le texte

// Composant fonctionnel NotAuth
const NotAuth = () => {
  return (
    // Affichage d'un message lorsque l'utilisateur n'est pas connecté, avec un style personnalisé
    <Text style={tw`text-2xl font-bold m-5`}>
      Bonjour, vous n'êtes pas connecté
    </Text>
  );
};

// Export du composant pour l'utiliser dans d'autres parties de l'application
export default NotAuth;
