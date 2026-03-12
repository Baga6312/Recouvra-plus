const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Single home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Recouvra+',
    docs: 'Start discovering at /api/docs'
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));





app.use('/api/auth',             require('./routes/authRoutes'));
app.use('/api/clients',          require('./routes/clientRoutes'));
app.use('/api/invoices',         require('./routes/invoiceRoutes'));
app.use('/api/payments',         require('./routes/paymentRoutes'));
app.use('/api/recovery-actions', require('./routes/recoveryActionRoutes'));
app.use('/api/stats',            require('./routes/statsRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Recouvra+ API is running ' });
});





app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Recouvra+ API démarrée sur le port ${PORT}`);
  console.log(`Swagger : http://localhost:${PORT}/api/docs`);
});

module.exports = { app, server };