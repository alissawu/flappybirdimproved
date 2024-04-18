const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// static from dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// send to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });