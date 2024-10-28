import "dotenv/config";

export default {
  expo: {
    name: "Swipp",
    slug: "swipp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/swipp_1.png",  // Assurez-vous que cette image est carrée
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/swipp_1.png",  // Assurez-vous que cette image est carrée
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.monapp.ios",  // Ajout du bundleIdentifier
      buildNumber: "1.0.0",  // Ajout du buildNumber
    },
    android: {
      package: "com.flucity.swipp",  // Assurez-vous que c'est le bon package
      versionCode: 1,  // Ajout du versionCode
      adaptiveIcon: {
        foregroundImage: "./assets/swipp_1.png",  // Assurez-vous que cette image est carrée
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",  // Fichier Google pour Firebase
      permissions: [  // Permissions Android
        "ACCESS_FINE_LOCATION"
      ],
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
