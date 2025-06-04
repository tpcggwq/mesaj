const correctPassword = "askimiz"; // Şifreni buraya yaz

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("password-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    typeWriter("text1", "Seninle geçen her gün, en güzel günüm... 💖", 0);
  } else {
    alert("Parola yanlış!");
  }
}

function nextPage(pageNumber) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById("page" + pageNumber).style.display = "block";
  if (pageNumber === 2) {
    typeWriter("text2", "Bu sayfa sadece sana özel... 💫", 0);
  }
}

document.getElementById("playMusic").onclick = function () {
  document.getElementById("music").play();
};

function typeWriter(id, text, i) {
  if (i < text.length) {
    document.getElementById(id).innerHTML += text.charAt(i);
    setTimeout(() => typeWriter(id, text, i + 1), 70);
  }
}
