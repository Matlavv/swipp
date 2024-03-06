import { useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import { Button, View } from "react-native";

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      "https://europe-west3-swipp-b74be.cloudfunctions.net/createPaymentIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1099,
        }),
      }
    );
    const { clientSecret } = await response.json();
    return { clientSecret };
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    const { clientSecret } = await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "Swipp",
    });
    if (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Erreur de paiement", error.message);
      return;
    }
    const result = await presentPaymentSheet();
    setLoading(false);
    if (result.error) {
      console.error(result.error);
      Alert.alert("Erreur de paiement", result.error.message);
    } else {
      console.log("Success");
      Alert.alert(
        "Paiement réussi",
        "Votre paiement a été effectué avec succès."
      );
    }
  };

  return (
    <View>
      <Button onPress={openPaymentSheet} title="Payer" disabled={loading} />
    </View>
  );
};

export default PaymentScreen;
