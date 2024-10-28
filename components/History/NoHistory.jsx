import { Text } from "react-native"; // Importation du composant Text de React Native
import tw from "twrnc"; // Importation de la bibliothèque Tailwind CSS pour styliser le texte

// Composant fonctionnel NotAuth
const NotAuth = () => {
  return (
    // Affichage du texte "aucun évènement" avec un style personnalisé
    <Text style={tw`text-2xl font-bold m-5`}>
      aucun évènement
    </Text>
  );
};

// Export du composant pour pouvoir l'utiliser dans d'autres parties de l'application
export default NotAuth;
