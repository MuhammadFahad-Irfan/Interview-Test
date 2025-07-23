import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import imageRoutes from './routes/imageRoutes';
import { connectDB } from './config/db';
import swaggerSpec from './config/swagger'
import * as swaggerUi from 'swagger-ui-express'
import logger from './config/winston';

dotenv.config();

const app = express();

app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/users', userRoutes);
app.use('/images', imageRoutes);

// MongoDB connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

export default app;
