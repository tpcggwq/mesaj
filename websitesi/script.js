const text = "Seni Çok Seviyorum... 💗";
let index = 0;
let direction = 1;

function typeWriter() {
  const display = document.getElementById("animatedText");
  if (direction === 1) {
    display.textContent = text.slice(0, ++index);
    if (index === text.length) {
      direction = -1;
      setTimeout(typeWriter, 2000);
    } else {
      setTimeout(typeWriter, 100);
    }
  } else {
    display.textContent = text.slice(0, --index);
    if (index === 0) {
      direction = 1;
      setTimeout(typeWriter, 500);
    } else {
      setTimeout(typeWriter, 50);
    }
  }
}

if (document.getElementById("animatedText")) {
  typeWriter();
}
