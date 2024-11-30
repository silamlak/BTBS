// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB5JvguWucetuFnjQqHyQRgq5C0NN25Ubg",
  authDomain: "ecom-3c659.firebaseapp.com",
  projectId: "ecom-3c659",
  storageBucket: "ecom-3c659.appspot.com",
  messagingSenderId: "839670894815",
  appId: "1:839670894815:web:8fdbba98ec7be9a57d996a",
  measurementId: "G-CYZ8RCQ4FP",
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
