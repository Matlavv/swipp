import React from "react"; // Importation de React pour créer des composants
import { Text, View } from "react-native"; // Importation des composants de base de React Native
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView pour éviter que le contenu chevauche les barres de statut ou de navigation

// Composant principal pour afficher les informations de panne
const BreakdownInfo = () => {
  return (
    // Utilisation de SafeAreaView pour s'assurer que le contenu ne chevauche pas les zones sensibles (comme la barre de statut)
    <SafeAreaView style={{ flex: 1 }}>
      <View> {/* Conteneur de base pour organiser les éléments à l'intérieur */}
        <Text>Breakdown Info</Text> {/* Affichage du texte "Breakdown Info" */}
      </View>
    </SafeAreaView>
  );
};

export default BreakdownInfo; // Export du composant pour l'utiliser dans d'autres parties de l'application
