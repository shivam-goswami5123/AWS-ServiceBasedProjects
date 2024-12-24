require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3'); // Correct AWS SDK v3 Client
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

// MongoDB connection
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit the process if the connection fails
    }
}

// MongoDB Schema and Model
const imageSchema = new mongoose.Schema({
    url: String,
    description: String
});
const Image = mongoose.model('Image', imageSchema);

// AWS S3 Configuration using AWS SDK v3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer configuration for file upload
const storage = multer.memoryStorage(); // Store file in memory before uploading to S3
const upload = multer({ storage });

// Routes
// Home route: display images
app.get('/', async (req, res) => {
    const images = await Image.find();
    res.render('index', { images });
});

// Upload page route
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Upload image handler
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Use @aws-sdk/lib-storage Upload to S3
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.S3_BUCKET,
                Key: `${Date.now().toString()}${path.extname(req.file.originalname)}`,
                Body: req.file.buffer, // File buffer
                ContentType: req.file.mimetype, // File content type
                ACL: 'public-read', // Access control
            },
        });

        const result = await upload.done();

        // Save the uploaded image information to MongoDB
        const newImage = new Image({
            url: result.Location, // S3 URL
            description: req.body.description,
        });

        await newImage.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
});

// Start the server after the database connection is successful
async function startServer() {
    await connectToDatabase(); // Ensure MongoDB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Start the server
startServer();
