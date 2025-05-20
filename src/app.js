// Firebase Config (Aynı proje için tutarlı olmalı)
const firebaseConfig = {
  apiKey: "AIzaSyDCnBMVNe3A9LPGbO_ZhExn5TKqWLz7WuU",
  authDomain: "mesaj-f1916.firebaseapp.com",
  projectId: "mesaj-f1916",
  storageBucket: "mesaj-f1916.appspot.com",
  messagingSenderId: "536452620539",
  appId: "1:536452620539:web:82a98f87008cf0eef0505e"
};

// Firebase'i başlat
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', () => {
  // Giriş Formu
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = 'chat.html'; // Başarılı girişte yönlendirme
        })
        .catch(error => {
          document.getElementById('login-error').textContent = error.message;
        });
    });
  }

  // Kayıt Formu
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Kullanıcıyı Firestore'a kaydet
          return db.collection('users').doc(userCredential.user.uid).set({
            username: username,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(() => {
          window.location.href = 'chat.html'; // Başarılı kayıtta yönlendirme
        })
        .catch(error => {
          document.getElementById('signup-error').textContent = error.message;
        });
    });
  }
});

// Kullanıcı oturum durumunu kontrol et
auth.onAuthStateChanged(user => {
  if (user) {
    // Kullanıcı giriş yapmışsa chat.html'e yönlendir
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('signup.html')) {
      window.location.href = 'chat.html';
    }
  } else {
    // Kullanıcı giriş yapmamışsa login.html'e yönlendir
    if (window.location.pathname.includes('chat.html')) {
      window.location.href = 'login.html';
    }
  }
});
