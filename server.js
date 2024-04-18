const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

express()
  .use(express.static(path.join(__dirname, 'public'))) // Replace 'public' with the directory where your HTML/CSS/JS files are
  .get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html'))) // Replace 'public' with the directory where your index.html file is
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
