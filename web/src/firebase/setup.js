import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3_WPNpaLABFSHvfoFB0f0s5EdbvrtYjk",
  authDomain: "chat-auth-a9da3.firebaseapp.com",
  databaseURL: "https://chat-auth-a9da3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-auth-a9da3",
  storageBucket: "chat-auth-a9da3.appspot.com",
  messagingSenderId: "408915646479",
  appId: "1:408915646479:web:a39990f6ee763fba902b7a",
  measurementId: "G-GDFJM74CVD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
