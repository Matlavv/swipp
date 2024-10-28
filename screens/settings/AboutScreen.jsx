// Importation des composants React Native nécessaires
import { View, Text } from 'react-native'; // Pour créer une vue et afficher du texte
import React from 'react'; // Importation de React

// Composant AboutScreen pour afficher une page "À propos"
const AboutScreen = () => {
  return (
    // Conteneur principal
    <View>
      {/* Texte simple indiquant le titre de la page */}
      <Text>AboutScreen</Text>
    </View>
  );
};

// Export du composant AboutScreen pour l'utiliser ailleurs dans l'application
export default AboutScreen;
