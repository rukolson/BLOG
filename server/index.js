const express = require('express');
require('dotenv').config();
const { connect } = require('mongoose');
const cors = require('cors');
const upload = require('express-fileupload');
const path = require('path');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection
connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Wyłącza serwer, jeśli nie można połączyć się z bazą
    });
