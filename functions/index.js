/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripeSecretKey =
  "sk_test_51Ojf5bF83Tq1HuHR4d48flqniJdmtwkoWAi5qXzJvP3fJOQH2speMP7JtyBy2VQ9ibqeDdVYLzlKatwPHTvjoDgk00TGPDfJSn";
const stripe = require("stripe")(stripeSecretKey);
admin.initializeApp();

exports.checkAndUpdateBookings = functions.pubsub
  .schedule("every 300 minutes")
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

exports.createStripeInvoiceOnPurchase = functions
  .region("europe-west3")
  .firestore.document("purchases/{purchaseId}")
  .onCreate(async (snap, context) => {
    try {
      const purchaseData = snap.data();
      const userId = purchaseData.userId;
      const amount = purchaseData.amount;
      // Récupérer ou créer un client Stripe
      const stripeCustomerId = await getOrCreateStripeCustomer(userId);
      // Créer une facture Stripe
      const invoice = await createStripeInvoice(stripeCustomerId, amount);
      // Stocker les informations de la facture dans Firebase
      await storeInvoiceData(userId, invoice);
      console.log("Facture créée et stockée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
    }
  });

async function getOrCreateStripeCustomer(userId) {
  const userRef = admin.firestore().collection("users").doc(userId);
  const doc = await userRef.get();
  const docData = doc.data();
  let stripeCustomerId = docData ? docData.stripeCustomerId : undefined;

  if (!stripeCustomerId) {
    const docData = doc.data();
    const email = docData ? docData.email : undefined;
    const customer = await stripe.customers.create({
      email: email,
    });
    stripeCustomerId = customer.id;
    await userRef.update({ stripeCustomerId });
  }

  return stripeCustomerId;
}

async function createStripeInvoice(stripeCustomerId, amount) {
  // Création d'un article de facturation
  const invoiceItem = await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    amount: amount * 100, // Convertir en centimes
    currency: "eur",
    description: "Achat de produit",
  });

  // Création de la facture
  const invoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    auto_advance: true,
  });

  // Finalisation de la facture déclenche l'envoi de l'email
  await stripe.invoices.finalizeInvoice(invoice.id);

  return invoice;
}

async function storeInvoiceData(userId, invoice) {
  const userInvoicesRef = admin
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("invoices");
  await userInvoicesRef.add({
    invoiceId: invoice.id,
    amount: invoice.total,
    created: invoice.created,
    invoice_pdf: invoice.invoice_pdf,
  });
}
