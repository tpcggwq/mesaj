// Elementleri seç
const formContainer = document.getElementById('form-container');
const formTitle = document.getElementById('form-title');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const submitBtn = document.getElementById('submit-btn');
const switchBtn = document.getElementById('switch-btn');

let isLogin = true;

// Giriş yapmış kullanıcı (sessionStorage'dan)
let loggedInUser = null;

// Kayıtlı kullanıcılar localStorage'da email (kullanıcı adı) ile saklanıyor
// Kullanıcı objesi: { password, friends: [], messages: { friendUsername: [{text, photo, note, from, timestamp}] } }

// Sayfa yüklendiğinde hatırlanan bilgileri doldur
window.onload = () => {
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  const rememberedPass = localStorage.getItem('rememberedPass');
  if (rememberedEmail && rememberedPass) {
    emailInput.value = rememberedEmail;
    passwordInput.value = rememberedPass;
    rememberCheckbox.checked = true;
  }
  // Eğer sessionStorage'da kullanıcı varsa direkt mesajlaşma ekranına geç
  const sessionUser = sessionStorage.getItem('loggedInUser');
  if (sessionUser) {
    loggedInUser = sessionUser;
    showChatUI();
  }
};

// Form tipini değiştir (Giriş/Kayıt)
switchBtn.onclick = () => {
  isLogin = !isLogin;
  if (isLogin) {
    formTitle.textContent = 'Giriş Yap';
    submitBtn.textContent = 'Giriş Yap';
    switchBtn.textContent = 'Kayıt Ol';
  } else {
    formTitle.textContent = 'Kayıt Ol';
    submitBtn.textContent = 'Kayıt Ol';
    switchBtn.textContent = 'Giriş Yap';
  }
  emailInput.value = '';
  passwordInput.value = '';
  rememberCheckbox.checked = false;
};

// Giriş veya kayıt işlemi
submitBtn.onclick = () => {
  const username = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!username || !password) {
    alert('Lütfen tüm alanları doldurun!');
    return;
  }

  if (isLogin) {
    // Giriş
    const userStr = localStorage.getItem(username);
    if (!userStr) {
      alert('Böyle bir kullanıcı bulunamadı!');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.password !== password) {
      alert('Şifre yanlış!');
      return;
    }
    loggedInUser = username;
    sessionStorage.setItem('loggedInUser', username);

    if (rememberCheckbox.checked) {
      localStorage.setItem('rememberedEmail', username);
      localStorage.setItem('rememberedPass', password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPass');
    }

    alert('Giriş başarılı!');
    showChatUI();

  } else {
    // Kayıt
    if (localStorage.getItem(username)) {
      alert('Bu kullanıcı zaten kayıtlı!');
      return;
    }
    if (password.length < 6) {
      alert('Şifre en az 6 karakter olmalı!');
      return;
    }
    const newUser = {
      password: password,
      friends: [],
      messages: {}
    };
    localStorage.setItem(username, JSON.stringify(newUser));
    alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    switchBtn.click();
  }
};

// Mesajlaşma arayüzü elementleri (sonradan oluşturulacak)
let chatContainer, friendListDiv, chatAreaDiv, messageInput, sendBtn, photoInput, noteInput, addFriendInput, addFriendBtn, logoutBtn;
let currentChatFriend = null;

// Mesajlaşma UI oluştur ve göster
function showChatUI() {
  formContainer.style.display = 'none';

  // Ana container
  chatContainer = document.createElement('div');
  chatContainer.style.display = 'flex';
  chatContainer.style.height = '90vh';
  chatContainer.style.width = '90vw';
  chatContainer.style.margin = '20px auto';
  chatContainer.style.background = '#111f3d';
  chatContainer.style.borderRadius = '12px';
  chatContainer.style.color = '#0ff';
  chatContainer.style.boxShadow = '0 0 30px #0ff5';

  // Sol panel - arkadaş listesi
  friendListDiv = document.createElement('div');
  friendListDiv.style.width = '25%';
  friendListDiv.style.borderRight = '2px solid #0ff';
  friendListDiv.style.padding = '10px';
  friendListDiv.style.overflowY = 'auto';

  // Başlık ve çıkış butonu
  const title = document.createElement('h2');
  title.textContent = `Hoşgeldin, ${loggedInUser}`;
  title.style.textAlign = 'center';

  logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Çıkış Yap';
  logoutBtn.style.width = '100%';
  logoutBtn.style.padding = '8px';
  logoutBtn.style.marginBottom = '10px';
  logoutBtn.style.cursor = 'pointer';
  logoutBtn.onclick = () => {
    sessionStorage.removeItem('loggedInUser');
    location.reload();
  };

  // Arkadaş ekleme
  addFriendInput = document.createElement('input');
  addFriendInput.placeholder = 'Arkadaş kullanıcı adı ekle';
  addFriendInput.style.width = '70%';
  addFriendInput.style.padding = '5px';
  addFriendInput.style.marginBottom = '10px';
  addFriendInput.style.borderRadius = '6px';
  addFriendInput.style.border = 'none';
  addFriendInput.style.fontSize = '1rem';

  addFriendBtn = document.createElement('button');
  addFriendBtn.textContent = 'Ekle';
  addFriendBtn.style.width = '28%';
  addFriendBtn.style.marginLeft = '2%';
  addFriendBtn.style.padding = '5px';
  addFriendBtn.style.cursor = 'pointer';

  const addFriendDiv = document.createElement('div');
  addFriendDiv.style.display = 'flex';
  addFriendDiv.appendChild(addFriendInput);
  addFriendDiv.appendChild(addFriendBtn);

  friendListDiv.appendChild(title);
  friendListDiv.appendChild(logoutBtn);
  friendListDiv.appendChild(addFriendDiv);

  // Arkadaş listesi gösterim alanı
  const friendsUl = document.createElement('ul');
  friendsUl.style.listStyle = 'none';
  friendsUl.style.padding = '0';
  friendListDiv.appendChild(friendsUl);

  // Sağ panel - mesajlaşma alanı
  chatAreaDiv = document.createElement('div');
  chatAreaDiv.style.flexGrow = '1';
  chatAreaDiv.style.padding = '10px';
  chatAreaDiv.style.display = 'flex';
  chatAreaDiv.style.flexDirection = 'column';
  chatAreaDiv.style.justifyContent = 'space-between';

  // Chat başlığı
  const chatTitle = document.createElement('h3');
  chatTitle.textContent = 'Arkadaşını seç ve sohbet et';
  chatTitle.style.textAlign = 'center';
  chatAreaDiv.appendChild(chatTitle);

  // Mesajlar için div
  const messagesDiv = document.createElement('div');
  messagesDiv.style.flexGrow = '1';
  messagesDiv.style.overflowY = 'auto';
  messagesDiv.style.border = '1px solid #0ff';
  messagesDiv.style.borderRadius = '10px';
  messagesDiv.style.padding = '10px';
  messagesDiv.style.marginBottom = '10px';
  messagesDiv.style.background = '#001122';
  chatAreaDiv.appendChild(messagesDiv);

  // Mesaj yazma alanı (foto + not + gönder)
  const messageForm = document.createElement('form');
  messageForm.style.display = 'flex';
  messageForm.style.gap = '10px';

  // Fotoğraf yükleme inputu
  photoInput = document.createElement('input');
  photoInput.type = 'file';
  photoInput.accept = 'image/*';
  photoInput.style.flexBasis = '20%';

  // Not inputu
  noteInput = document.createElement('input');
  noteInput.type = 'text';
  noteInput.placeholder = 'Mesaj veya not yaz...';
  noteInput.style.flexGrow = '1';
  noteInput.required = true;

  // Gönder butonu
  sendBtn = document.createElement('button');
  sendBtn.type = 'submit';
  sendBtn.textContent = 'Gönder';
  sendBtn.style.flexBasis = '20%';

  messageForm.appendChild(photoInput);
  messageForm.appendChild(noteInput);
  messageForm.appendChild(sendBtn);

  chatAreaDiv.appendChild(messageForm);

  document.body.appendChild(chatContainer);
  chatContainer.appendChild(friendListDiv);
  chatContainer.appendChild(chatAreaDiv);

  // Kullanıcının arkadaş listesini getir ve listele
  const user = JSON.parse(localStorage.getItem(loggedInUser));
  const friends = user.friends || [];

  function refreshFriendsList() {
    friendsUl.innerHTML = '';
    friends.forEach(friend => {
      const li = document.createElement('li');
      li.textContent = friend;
      li.style.cursor = 'pointer';
      li.style.padding = '5px';
      li.style.borderBottom = '1px solid #0ff';
      li.onclick = () => openChatWith(friend);
      friendsUl.appendChild(li);
    });
  }
  refreshFriendsList();

  // Arkadaş ekleme fonksiyonu
  addFriendBtn.onclick = (e) => {
    e.preventDefault();
    const newFriend = addFriendInput.value.trim().toLowerCase();
    if (newFriend === loggedInUser) {
      alert('Kendini arkadaş olarak ekleyemezsin!');
      return;
    }
    if (!newFriend) {
      alert('Lütfen bir kullanıcı adı girin.');
      return;
    }
    if (!localStorage.getItem(newFriend)) {
      alert('Böyle bir kullanıcı bulunamadı!');
      return;
    }
    if (friends.includes(newFriend)) {
      alert('Bu kullanıcı zaten arkadaş listende.');
      return;
    }
    friends.push(newFriend);
    user.friends = friends;
    localStorage.setItem(loggedInUser, JSON.stringify(user));
    refreshFriendsList();
    addFriendInput.value = '';
    alert('Arkadaş eklendi!');
  };

  // Chat açma fonksiyonu
  function openChatWith(friend) {
    currentChatFriend = friend;
    chatTitle.textContent = `Sohbet: ${friend}`;
    messagesDiv.innerHTML = '';

    const messages = (user.messages && user.messages[friend]) || [];

    messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.style.marginBottom = '10px';
      msgDiv.style.borderBottom = '1px solid #0ff';

      const fromText = msg.from === loggedInUser ? 'Sen' : friend;
      const time = new Date(msg.timestamp).toLocaleTimeString();

      if (msg.photo) {
        const img = document.createElement('img');
        img.src = msg.photo;
        img.style.maxWidth = '100px';
        img.style.display = 'block';
        img.style.marginBottom = '5px';
        msgDiv.appendChild(img);
      }

      const noteP = document.createElement('p');
      noteP.textContent = `${fromText} (${time}): ${msg.note}`;
      msgDiv.appendChild(noteP);

      messagesDiv.appendChild(msgDiv);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Mesaj gönderme
  messageForm.onsubmit = (e) => {
    e.preventDefault();
    if (!currentChatFriend) {
      alert('Lütfen önce bir arkadaş seçin!');
      return;
    }
    const note = noteInput.value.trim();
    if (!note) {
      alert('Mesaj veya not boş olamaz!');
      return;
    }

    // Foto varsa oku base64 olarak
    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];
      const reader = new FileReader();
      reader.onload = function(evt) {
        saveMessage(evt.target.result, note);
      };
      reader.readAsDataURL(file);
    } else {
      saveMessage(null, note);
    }
  };

  // Mesaj kaydetme fonksiyonu
  function saveMessage(photoBase64, note) {
    const timestamp = Date.now();

    // Gönderen kullanıcı objesi ve mesajlar
    const senderUser = JSON.parse(localStorage.getItem(loggedInUser));
    if (!senderUser.messages) senderUser.messages = {};
    if (!senderUser.messages[currentChatFriend]) senderUser.messages[currentChatFriend] = [];

    // Alıcı kullanıcı objesi ve mesajlar
    const receiverUser = JSON.parse(localStorage.getItem(currentChatFriend));
    if (!receiverUser.messages) receiverUser.messages = {};
    if (!receiverUser.messages[loggedInUser]) receiverUser.messages[loggedInUser] = [];

    // Mesaj objesi
    const msgObj = {
      from: loggedInUser,
      photo: photoBase64,
      note,
      timestamp
    };

    // Gönderenin mesajlarına ekle
    senderUser.messages[currentChatFriend].push(msgObj);
    // Alıcının mesajlarına ekle
    receiverUser.messages[loggedInUser].push(msgObj);

    // Güncelle localStorage
    localStorage.setItem(loggedInUser, JSON.stringify(senderUser));
    localStorage.setItem(currentChatFriend, JSON.stringify(receiverUser));

    // Mesaj kutusunu temizle
    noteInput.value = '';
    photoInput.value = '';

    // Mesajı göster
    openChatWith(currentChatFriend);
  }
}
