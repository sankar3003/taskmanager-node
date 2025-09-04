const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const redis= require("redis")

dotenv.config();

const authRoutes = require('./routes/authRoute');
const taskRoutes = require('./routes/taskRoute');
const userRoutes = require('./routes/userRoute');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression())
const client = redis.createClient();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
// Test route
app.get('/ping', (req, res) => {

  res.send('Server is running 🚀');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize:50
})
.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
