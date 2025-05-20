import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCnBMVNe3A9LPGbO_ZhExn5TKqWLz7WuU",
  authDomain: "mesaj-f1916.firebaseapp.com",
  projectId: "mesaj-f1916",
  storageBucket: "mesaj-f1916.appspot.com",
  messagingSenderId: "536452620539",
  appId: "1:536452620539:web:82a98f87008cf0eef0505e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
