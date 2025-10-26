  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAnQVPOGHGnQPdcfrHx3VOLdsEWDnZhSpg",
    authDomain: "hosted-game.firebaseapp.com",
    projectId: "hosted-game",
    storageBucket: "hosted-game.firebasestorage.app",
    messagingSenderId: "109068112763",
    appId: "1:109068112763:web:9447fc8eed7ebf4de263de",
    measurementId: "G-39J7YCKQT1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
