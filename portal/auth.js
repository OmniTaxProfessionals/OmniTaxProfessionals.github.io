// Import Firebase modules

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 

  getAuth, 

  signInWithEmailAndPassword 

} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



// 🔑 YOUR FIREBASE CONFIG

const firebaseConfig = {
  apiKey: "AIzaSyBOND-wraRXGL0jB8xK2zHnDMBXBhA5WRk",
  authDomain: "otp-client-login.firebaseapp.com",
  projectId: "otp-client-login",
};



// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);



// Login logic

document.getElementById("loginBtn").addEventListener("click", () => {

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;



  signInWithEmailAndPassword(auth, email, password)

    .then(() => {

      window.location.href = "dashboard.html";

    })

    .catch(err => {

      alert(err.message);

    });

});