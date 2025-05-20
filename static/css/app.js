// Firebase configini buraya kendi firebase projenle değiştir
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTHDOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elementler
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

const friendsList = document.getElementById("friends-list");
const friendEmailInput = document.getElementById("friend-email");
const addFriendBtn = document.getElementById("add-friend-btn");

const chatWithTitle = document.getElementById("chat-with");
const messagesDiv = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let currentUser = null;
let currentChatFriend = null;

// Sekme geçişleri
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
});

// Kayıt olma
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const username = document.getElementById("signup-username").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    currentUser = userCredential.user;

    // Kullanıcı adı ekle
    await db.collection("users").doc(currentUser.uid).set({
      username,
      email,
      friends: [],
    });

    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    signupForm.reset();
    loginTab.click();
  } catch (error) {
    alert("Kayıt hatası: " + error.message);
  }
});

// Giriş yapma
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    currentUser = userCredential.user;
    initApp();
  } catch (error) {
    alert("Giriş hatası: " + error.message);
  }
});

// Kullanıcı çıkış yaparsa sayfayı yenile
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    initApp();
  } else {
    currentUser = null;
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    friendsList.innerHTML = "";
    messagesDiv.innerHTML = "";
  }
});

// Uygulama başlatma
async function initApp() {
  authSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  loadFriends();
}

// Arkadaşları yükle
async function loadFriends() {
  friendsList.innerHTML = "<li>Yükleniyor...</li>";
  const doc = await db.collection("users").doc(currentUser.uid).get();
  if (!doc.exists) {
    friendsList.innerHTML = "<li>Arkadaş bulunamadı.</li>";
    return;
  }
  const data = doc.data();
  const friends = data.friends || [];
  if (friends.length === 0) {
    friendsList.innerHTML = "<li>Henüz arkadaş eklenmedi.</li>";
    return;
  }
  friendsList.innerHTML = "";
  friends.forEach(async (friendUid) => {
    const friendDoc = await db.collection("users").doc(friendUid).get();
    if (friendDoc.exists) {
      const friendData = friendDoc.data();
      const li = document.createElement("li");
      li.textContent = friendData.username + " (" + friendData.email + ")";
      li.dataset.uid = friendUid;
      li.addEventListener("click", () => openChat(friendUid, friendData.username));
      friendsList.appendChild(li);
    }
  });
}

// Arkadaş ekleme
addFriendBtn.addEventListener("click", async () => {
  const friendEmail = friendEmailInput.value.trim();
  if (!friendEmail) {
    alert("Lütfen arkadaşınızın e-postasını girin.");
    return;
  }
  if (friendEmail === currentUser.email) {
    alert("Kendinizi arkadaş olarak ekleyemezsiniz.");
    return;
  }

  try {
    // Arkadaşın kullanıcı ID'sini bul
    const querySnapshot = await db.collection("users").where("email", "==", friendEmail).get();
    if (querySnapshot.empty) {
      alert("Bu e-postaya sahip kullanıcı bulunamadı.");
      return;
    }

    const friendDoc = querySnapshot.docs[0];
    const friendUid = friendDoc.id;

    // Kendi arkadaş listeni güncelle
    const userDocRef = db.collection("users").doc(currentUser.uid);
    const userDoc = await userDocRef.get();
    const userData = userDoc.data();

    if (userData.friends.includes(friendUid)) {
      alert("Bu kişi zaten arkadaş listenizde.");
      return;
    }

    await userDocRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(friendUid)
    });

    // Karşı tarafın arkadaş listesine de seni ekle
    const friendDocRef = db.collection("users").doc(friendUid);
    await friendDocRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
    });

    alert("Arkadaş başarıyla eklendi!");
    friendEmailInput.value = "";
    loadFriends();
  } catch (error) {
    alert("Arkadaş ekleme hatası: " + error.message);
  }
});

// Sohbet açma
function openChat(friendUid, friendName) {
  currentChatFriend = friendUid;
  chatWithTitle.textContent = friendName;
  messagesDiv.innerHTML = "";
  loadMessages();
}

// Mesajları yükle
function loadMessages() {
  if (!currentChatFriend) return;
  const chatId = generateChatId(currentUser.uid, currentChatFriend);

  db.collection("chats").doc(chatId).collection("messages")
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      messagesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const msg = doc.data();
        const messageEl = document.createElement("div");
        messageEl.classList.add("message");
        messageEl.classList.add(msg.sender === currentUser.uid ? "sent" : "received");
        messageEl.textContent = msg.text;
        messagesDiv.appendChild(messageEl);
      });
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Mesaj gönderme
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentChatFriend) {
    alert("Lütfen önce bir arkadaş seçin.");
    return;
  }
  const text = messageInput.value.trim();
  if (text === "") return;

  const chatId = generateChatId(currentUser.uid, currentChatFriend);

  try {
    await db.collection("chats").doc(chatId).collection("messages").add({
      sender: currentUser.uid,
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    messageInput.value = "";
  } catch (error) {
    alert("Mesaj gönderilemedi: " + error.message);
  }
});

// Chat id oluşturma (küçük uid ile büyük uid yi alfabetik sırayla birleştir)
function generateChatId(uid1, uid2) {
  return uid1 < uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
}
