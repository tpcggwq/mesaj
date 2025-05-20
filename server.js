const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Static dosyalar
app.use(express.static('public'));

// Tüm istekleri index.html'e yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Çalışıyor: http://localhost:${PORT}`));
