/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripeSecretKey =
  "sk_test_51Ojf5bF83Tq1HuHR4d48flqniJdmtwkoWAi5qXzJvP3fJOQH2speMP7JtyBy2VQ9ibqeDdVYLzlKatwPHTvjoDgk00TGPDfJSn";
const stripe = require("stripe")(stripeSecretKey);
admin.initializeApp();

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

exports.createPaymentIntent = functions
  .region("europe-west3")
  .https.onRequest(async (request, response) => {
    try {
      const { amount } = request.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur",
      });
      response.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      response.status(500).send(error);
    }
  });
