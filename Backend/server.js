const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import routes and middleware
const authRoutes = require('./routes/auth');
const nurseRoutes = require('./routes/nurses');
const clientRoutes = require('./routes/clients');
const dailyLogRoutes = require('./routes/dailyLogs');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/nurses', authMiddleware, nurseRoutes); // Protected
app.use('/api/clients', authMiddleware, clientRoutes); // Protected
app.use('/api/logs', authMiddleware, dailyLogRoutes); // Protected


// DB Connection and Sync
sequelize.authenticate()
    .then(() => {
        console.log('MySQL connection successful.');
        return sequelize.sync({ alter: true }); // Use alter: true to avoid dropping tables
    })
    .then(() => console.log('Database synchronized.'))
    .catch(err => console.error('Unable to connect to the database:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));