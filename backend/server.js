const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards');
const commentRoutes = require('./routes/comments');
const statsRoutes = require('./routes/stats');
const { checkExpiredCards } = require('./utils/notifications');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stats', statsRoutes);

// DB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    // Start server only after DB connected
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });

    // Check expired cards every hour
    setInterval(checkExpiredCards, 1000 * 60 * 60);
  })
  .catch(err => console.error(err));
