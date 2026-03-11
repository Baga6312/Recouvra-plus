const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const clientRoutes = require("./src/routes/clientRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");

dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth',             require('./routes/authRoutes'));
app.use('/api/clients',          require('./routes/clientRoutes'));
app.use('/api/invoices',         require('./routes/invoiceRoutes'));
app.use('/api/payments',         require('./routes/paymentRoutes'));
app.use('/api/recovery-actions', require('./routes/recoveryActionRoutes'));
app.use('/api/stats',            require('./routes/statsRoutes'));
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Recouvra+ API is running 🚀' });
});

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Recouvra+ API démarrée sur le port ${PORT}`);
  console.log(`📚 Swagger : http://localhost:${PORT}/api/docs`);
});

module.exports = { app, server };
