// Fotoğraf büyütme özelliği
document.querySelectorAll('[data-zoomable]').forEach(card => {
  card.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('zoomed');
    document.body.style.overflow = this.classList.contains('zoomed') ? 'hidden' : '';
  });
});

// Kalp animasyonu
function createHearts(count=15) {
  const container = document.createElement('div');
  container.className = 'floating-hearts';
  
  for(let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 100}vh`;
    heart.style.fontSize = `${10 + Math.random() * 20}px`;
    heart.style.color = `hsl(${Math.random() * 60 + 350}, 100%, 70%)`;
    heart.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(heart);
  }
  
  document.body.appendChild(container);
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', () => {
  createHearts();
});
