const express = require('express');
const cors = require('cors');

require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Default 3000

// Middleware
app.use(cors()); //  Cross-Origin Resource Sharing
app.use(express.json()); // To handle JSON requests (if needed later)

// test route
app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.listen(port, () => {
  console.log(`Example app is listening on port ${port}.`);
});
