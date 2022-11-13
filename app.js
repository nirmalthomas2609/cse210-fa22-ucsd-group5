const express = require('express');

const app = express();

app.get('/', function (req, res) {
  res.send('Simple Web Application is UP')
})

app.listen(8081, function () {
  console.log('Simple Web Application running on port 8081!')
})

// https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
