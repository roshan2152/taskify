// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAxAE2cc0uprMb6FaOuj972aQZVBbDP4Q",
  authDomain: "taskify-70457.firebaseapp.com",
  projectId: "taskify-70457",
  storageBucket: "taskify-70457.appspot.com",
  messagingSenderId: "229341980097",
  appId: "1:229341980097:web:40c50ab8f217d224407b40",
  measurementId: "G-WF353XT6SY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;