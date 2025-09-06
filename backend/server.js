import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { testConnection } from './config/supabase.js';

// Import middlewares
import errorHandler from './middlewares/errorHandler.js';

// Import API v1.0 routes
import authRoutes from './routes/api/v1/auth.js';
import projectRoutes from './routes/api/v1/projects.js';
import taskRoutes from './routes/api/v1/tasks.js';
import userRoutes from './routes/api/v1/users.js';
import dashboardRoutes from './routes/api/v1/dashboard.js';
import notificationRoutes from './routes/api/v1/notifications.js';
import invitationRoutes from './routes/api/v1/invitations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only requests from this origin
    methods: 'GET,POST', // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SynergySphere API v1.0', 
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// API v1.0 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/invitations', invitationRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Start server
const startServer = async () => {
  try {
    // Test Supabase connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('Failed to connect to Supabase. Please check your configuration.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api/v1`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
