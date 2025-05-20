// KALP ANİMASYON SİSTEMİ
document.addEventListener('DOMContentLoaded', () => {
  const createHeart = () => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤';
    heart.style.cssText = `
      left: ${Math.random() * 100}vw;
      font-size: ${15 + Math.random() * 25}px;
      color: hsl(${Math.random() * 360}, 100%, 70%);
      animation-duration: ${4 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 2}s;
    `;
    document.body.appendChild(heart);
    
    // Animasyon bitince kalbi kaldır
    setTimeout(() => heart.remove(), 7000);
  };

  // İlk 15 kalp
  for (let i = 0; i < 15; i++) {
    setTimeout(createHeart, i * 300);
  }

  // Sürekli üretim
  const heartInterval = setInterval(createHeart, 800);
  
  // Temizlik fonksiyonu
  window.addEventListener('beforeunload', () => {
    clearInterval(heartInterval);
  });
});
