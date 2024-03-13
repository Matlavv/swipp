import "dotenv/config";

export default {
  expo: {
    name: "swipp",
    slug: "swipp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/swipp_1.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/swipp_1.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.flucity.swipp",
      adaptiveIcon: {
        foregroundImage: "./assets/swipp_1.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/swipp_1.png",
    },
    extra: {
      eas: {
        projectId: "3c2e5dee-fd44-4176-86b5-b290a78018ea",
      },
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      geocoderApiKey: process.env.GEOCODER_API_KEY,
    },
  },
};
