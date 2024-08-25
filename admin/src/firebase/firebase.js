// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5JvguWucetuFnjQqHyQRgq5C0NN25Ubg",
  authDomain: "ecom-3c659.firebaseapp.com",
  projectId: "ecom-3c659",
  storageBucket: "ecom-3c659.appspot.com",
  messagingSenderId: "839670894815",
  appId: "1:839670894815:web:8fdbba98ec7be9a57d996a",
  measurementId: "G-CYZ8RCQ4FP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app