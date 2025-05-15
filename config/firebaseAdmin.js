import admin from "firebase-admin";

// Load service account key from Firebase
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


export const sendNotification = async (token, title, body) => {
  const message = {
    notification: { title, body },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
  } catch (error) {
    console.error("Error sending notification", error);
  }
};
