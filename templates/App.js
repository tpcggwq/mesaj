// app.js

// Elementler
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');

const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');

const userNameDisplay = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

const friendUsernameInput = document.getElementById('friend-username');
const addFriendBtn = document.getElementById('add-friend-btn');
const friendsListDiv = document.getElementById('friends-list');

const chatArea = document.getElementById('chat-area');
const noteInput = document.getElementById('note-input');
const photoInput = document.getElementById('photo-input');
const sendMsgBtn = document.getElementById('send-msg-btn');

// Global değişkenler
let currentUser = null;
let friends = [];
let activeFriend = null;

// Yerel depolama anahtarları
function getUserKey(username) {
  return 'user_' + username.toLowerCase();
}

function saveUser(user) {
  localStorage.setItem(getUserKey(user.username), JSON.stringify(user));
}

function loadUser(username) {
  const data = localStorage.getItem(getUserKey(username));
  return data ? JSON.parse(data) : null;
}

// Kayıt ol
registerBtn.onclick = () => {
  const username = usernameInput.value.trim().toLowerCase();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!username || !email || !password) {
    alert('Lütfen tüm alanları doldurun!');
    return;
  }

  if (loadUser(username)) {
    alert('Bu kullanıcı adı zaten kayıtlı!');
    return;
  }

  if (password.length < 6) {
    alert('Şifre en az 6 karakter olmalı!');
    return;
  }

  const newUser = {
    username,
    email,
    password,
    friends: [],
    messages: {}  // Arkadaşlara ait mesajlar için
  };

  saveUser(newUser);
  alert('Kayıt başarılı! Giriş yapabilirsiniz.');
  clearLoginFields();
};

// Giriş yap
loginBtn.onclick = () => {
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!username || !password) {
    alert('Lütfen kullanıcı adı ve şifre girin!');
    return;
  }

  const user = loadUser(username);
  if (!user) {
    alert('Kullanıcı bulunamadı!');
    return;
  }

  if (user.password !== password) {
    alert('Şifre yanlış!');
    return;
  }

  currentUser = user;
  friends = currentUser.friends || [];
  showChatUI();
  renderFriendsList();
};

// Çıkış yap
logoutBtn.onclick = () => {
  currentUser = null;
  friends = [];
  activeFriend = null;
  chatArea.innerHTML = '';
  clearLoginFields();
  chatContainer.style.display = 'none';
  loginContainer.style.display = 'block';
};

// Arkadaş listesi göster
function renderFriendsList() {
  friendsListDiv.innerHTML = '';
  if (friends.length === 0) {
    friendsListDiv.innerHTML = '<p>Henüz arkadaşınız yok.</p>';
    return;
  }
  friends.forEach(friend => {
    const div = document.createElement('div');
    div.textContent = friend;
    div.style.cursor = 'pointer';
    div.onclick = () => {
      activeFriend = friend;
      renderChatMessages();
    };
    friendsListDiv.appendChild(div);
  });
}

// Arkadaş ekle
addFriendBtn.onclick = () => {
  const friendUsername = friendUsernameInput.value.trim().toLowerCase();
  if (!friendUsername) return alert('Lütfen kullanıcı adı girin.');

  if (friendUsername === currentUser.username) {
    return alert('Kendinizi arkadaş olarak ekleyemezsiniz!');
  }

  const friendUser = loadUser(friendUsername);
  if (!friendUser) {
    return alert('Böyle bir kullanıcı yok!');
  }

  if (friends.includes(friendUsername)) {
    return alert('Bu kullanıcı zaten arkadaş listenizde!');
  }

  friends.push(friendUsername);
  currentUser.friends = friends;
  saveUser(currentUser);

  // Karşı tarafa da seni ekle (ters yönlü)
  if (!friendUser.friends.includes(currentUser.username)) {
    friendUser.friends.push(currentUser.username);
    saveUser(friendUser);
  }

  friendUsernameInput.value = '';
  renderFriendsList();
};

// Mesaj gönder
sendMsgBtn.onclick = () => {
  if (!activeFriend) {
    alert('Lütfen bir arkadaş seçin!');
    return;
  }

  const note = noteInput.value.trim();
  const file = photoInput.files[0];

  if (!note && !file) {
    alert('Mesaj veya fotoğraf girin!');
    return;
  }

  const timestamp = Date.now();

  // Mesaj objesi
  const msg = {
    from: currentUser.username,
    to: activeFriend,
    note,
    photo: null,
    timestamp
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      msg.photo = e.target.result;

      saveMessage(msg);
      noteInput.value = '';
      photoInput.value = '';
      renderChatMessages();
    };
    reader.readAsDataURL(file);
  } else {
    saveMessage(msg);
    noteInput.value = '';
    renderChatMessages();
  }
};

function saveMessage(msg) {
  // currentUser.messages içinde activeFriend için array olacak
  if (!currentUser.messages[msg.to]) currentUser.messages[msg.to] = [];
  currentUser.messages[msg.to].push(msg);

  // Aynı mesajı arkadaşın messagesına da ekle
  const friendUser = loadUser(msg.to);
  if (!friendUser.messages[msg.from]) friendUser.messages[msg.from] = [];
  friendUser.messages[msg.from].push(msg);

  saveUser(currentUser);
  saveUser(friendUser);
}

// Mesajları göster
function renderChatMessages() {
  chatArea.innerHTML = '';
  if (!activeFriend) {
    chatArea.innerHTML = '<p>Lütfen bir arkadaş seçin.</p>';
    return;
  }

  // currentUser.messages[activeFriend] ve arkadaşın mesajları
  const msgs1 = currentUser.messages[activeFriend] || [];
  const friendUser = loadUser(activeFriend);
  const msgs2 = friendUser.messages[currentUser.username] || [];

  // İki tarafın mesajlarını tarihe göre birleştir
  const allMsgs = msgs1.concat(msgs2);
  allMsgs.sort((a, b) => a.timestamp - b.timestamp);

  allMsgs.forEach(m => {
    const div = document.createElement('div');
    div.className = 'message';
    div.style.borderBottom = '1px dotted #0ff';
    div.style.paddingBottom = '8px';
    div.innerHTML = `<b>${m.from === currentUser.username ? 'Sen' : m.from}</b>: ${m.note ? m.note : ''}`;
    if (m.photo) {
      const img = document.createElement('img');
      img.src = m.photo;
      div.appendChild(img);
    }
    chatArea.appendChild(div);
  });

  // Scroll sonuna kaydır
  chatArea.scrollTop = chatArea.scrollHeight;
}

function clearLoginFields() {
  usernameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
}

function showChatUI() {
  loginContainer.style.display = 'none';
  chatContainer.style.display = 'block';
  userNameDisplay.textContent = currentUser.username;
  friendUsernameInput.value = '';
  noteInput.value = '';
  photoInput.value = '';
  activeFriend = null;
  chatArea.innerHTML = '<p>Arkadaş listenden birini seçip mesajlaşmaya başlayabilirsin.</p>';
}
