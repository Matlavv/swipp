import React from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import tw from "twrnc";

const LegalMentionsPage = () => {
  return (
    <SafeAreaView style={tw`flex-1 p-4 mt-2`}>
      <ScrollView>
        <Text style={tw`text-lg font-bold mb-4`}>Mentions légales</Text>

        <Text style={tw`mb-2`}>
          Swipp est une application proposée par Flucity, une société
          spécialisée dans les services automobiles.
        </Text>

        <Text style={tw`mb-2 font-semibold`}>Siège social :</Text>
        <Text style={tw`mb-2`}>
          [Adresse complète du siège social de Flucity]
        </Text>

        <Text style={tw`mb-2 font-semibold`}>Immatriculation :</Text>
        <Text style={tw`mb-2`}>[Numéro d'immatriculation de l'entreprise]</Text>

        <Text style={tw`mb-2 font-semibold`}>Contact :</Text>
        <Text style={tw`mb-2`}>[Adresse email]</Text>
        <Text style={tw`mb-2`}>[Numéro de téléphone]</Text>

        <Text style={tw`mb-2 font-semibold`}>
          Directeur de la publication :
        </Text>
        <Text style={tw`mb-2`}>[Nom du directeur de la publication]</Text>

        <Text style={tw`mb-2 font-semibold`}>Hébergement :</Text>
        <Text style={tw`mb-2`}>
          [Nom et adresse de l'hébergeur du site/app]
        </Text>

        <Text style={tw`mb-2 font-semibold`}>
          Description des services fournis :
        </Text>
        <Text style={tw`mb-2`}>
          Swipp propose la livraison de carburant à l'adresse indiquée par
          l'utilisateur via des employés auto-entrepreneurs et des réservations
          chez des garagistes partenaires pour divers services automobiles.
        </Text>

        <Text style={tw`mb-2 font-semibold`}>Propriété intellectuelle :</Text>
        <Text style={tw`mb-2`}>
          Tous les contenus présents sur l'application Swipp, incluant, mais
          sans s'y limiter, les logos, textes, graphiques et images sont
          protégés par le droit de la propriété intellectuelle et appartiennent
          à Flucity ou à ses partenaires.
        </Text>

        <Text style={tw`mb-2 font-semibold`}>
          Limitations de responsabilité :
        </Text>
        <Text style={tw`mb-2`}>
          Flucity ne saurait être tenue responsable des dommages directs ou
          indirects causés au matériel de l'utilisateur, lors de l'accès à
          l'application Swipp. Flucity décline également toute responsabilité
          quant à l'utilisation qui pourrait être faite des informations et
          contenus présents sur Swipp.
        </Text>

        <Text style={tw`mb-2 font-semibold`}>
          Gestion des données personnelles :
        </Text>
        <Text style={tw`mb-2`}>
          La société Flucity s'engage à préserver la confidentialité des
          informations fournies par l'utilisateur sur l'application Swipp,
          conformément à la législation en vigueur sur la protection des données
          personnelles.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LegalMentionsPage;
