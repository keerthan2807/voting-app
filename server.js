const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for votes
const votes = {
  option1: 0,
  option2: 0
};

// API routes
app.get('/api/votes', (req, res) => {
  res.json(votes);
});

app.post('/api/vote', (req, res) => {
  const { option } = req.body;
  
  if (option === 'option1' || option === 'option2') {
    votes[option]++;
    res.json({ success: true, votes });
  } else {
    res.status(400).json({ success: false, message: 'Invalid option' });
  }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 