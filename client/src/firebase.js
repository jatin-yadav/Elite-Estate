import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "elite-estate-a832d.firebaseapp.com",
  projectId: "elite-estate-a832d",
  storageBucket: "elite-estate-a832d.appspot.com",
  messagingSenderId: "706148888896",
  appId: "1:706148888896:web:cfe0be04ba80f7e6dd8aa5",
};

export const app = initializeApp(firebaseConfig);
