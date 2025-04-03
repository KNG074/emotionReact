const express = require('express');
const bodyParser = require('body-parser');
const emotionRoutes = require('../Routes/emotionRoutes');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // เพิ่ม cors middleware

app.use(bodyParser.json());
app.use('/', emotionRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});