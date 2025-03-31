import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUHR-fOUhn9m_0iz3tAl1GiQyRiUN0f0c",
    authDomain: "campus-navigation-ad1f5.firebaseapp.com",
    projectId: "campus-navigation-ad1f5",
    storageBucket: "campus-navigation-ad1f5.appspot.com",
    messagingSenderId: "785057315056",
    appId: "1:785057315056:web:bfb57d79d8850476f72a35"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
