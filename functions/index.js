/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(stripeSecretKey);
const stripeSecretKey =
  "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";
admin.initializeApp();

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création du PaymentIntent");
  }
});

exports.checkAndUpdateBookings = functions.pubsub
  .schedule("every 60 minutes")
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();

    const updateBookingStatus = async (collectionName) => {
      const bookings = await db
        .collection(collectionName)
        .where("isActive", "==", true)
        .where("bookingDate", "<=", now)
        .get();

      const batch = db.batch();

      bookings.forEach((doc) => {
        batch.update(doc.ref, { isActive: false });
      });

      await batch.commit();
      console.log(`Updated bookings in ${collectionName}`);
    };

    await updateBookingStatus("RefuelBookings");
    await updateBookingStatus("RepairBookings");

    return null;
  });
