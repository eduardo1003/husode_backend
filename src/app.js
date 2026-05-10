const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
      "media-src": ["'self'", "https://res.cloudinary.com"],
      "connect-src": ["'self'", "https://res.cloudinary.com"]
    },
  },
}));

app.use(cors({
  origin: true, // Allow all origins for now to troubleshoot, or set to specific Vercel URL
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const mediaRoutes = require('./routes/media');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const contactsRoutes = require('./routes/contacts');
const configRoutes = require('./routes/config');
const directiveRoutes = require('./routes/directive');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/config', configRoutes);
app.use('/api/directive', directiveRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'API responds successfully!' }));

module.exports = app;
