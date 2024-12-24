# Image Upload Web App

A web application that allows users to upload images, which are then stored in an AWS S3 bucket and the image details are saved in a MongoDB database. The project uses Node.js, Express, MongoDB, AWS SDK, Multer for file uploads, and EJS for templating.

## Features
- Image upload functionality.
- Images are stored in AWS S3 with a `public-read` ACL.
- Image metadata (URL and description) is saved in MongoDB.
- Displays uploaded images on the home page.

## Prerequisites

- **Node.js**: Make sure you have [Node.js](https://nodejs.org/) installed.
- **MongoDB Atlas**: You need a MongoDB Atlas account with a cluster.
- **AWS Account**: You need an AWS account to configure an S3 bucket.

## File Structure
```bash
image-upload-web-app/
├── .env                # Environment variables for AWS and MongoDB credentials
├── package.json        # Project dependencies and metadata
├── server.js           # Main server file
├── views/              # EJS templates
│   ├── index.ejs       # Home page to display images
│   ├── upload.ejs      # Page for uploading images
├── node_modules/       # Project dependencies (automatically created by npm)
├── public/             # Static files (e.g., CSS, JS)
│   └── styles.css      # Custom CSS for the application
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Installation
```bash
#1. Clone the repository: 
   git clone https://github.com/your-username/repo-name.git
   cd repo-name
#2. Install dependencies:
   npm install
#3. Create a .env file in the root directory and add your credentials:
    touch .env
#4. Copy the contents from .env.sample file and relace with your credentials
#5. Start the application
    node server.js

```

## Important Note

-Generate a IAM User and create aws credentials access key for that user.
-Provide S3 Bucket required permissions to that user.
-Create S3 bucket and Enable ACls and Turn off/Uncheck Block Public Access.


