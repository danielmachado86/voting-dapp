const express = require("express");
var path = require('path');

const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

console.log(__dirname)

app.use(express.static(path.resolve(__dirname, 'html')));