const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios'); // Add axios to your server dependencies
const File = require('../models/File'); // Make sure the path is correct (capital F)
const multer = require('multer');
const path = require('path');

// Add this at the top of the file
const API_URL = 'https://api.example.com'; // Your original API URL

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Generic proxy function
const proxyRequest = async (req, res, method, endpoint) => {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data: method !== 'GET' ? req.body : undefined,
      params: method === 'GET' ? req.query : undefined,
      headers: {
        'Content-Type': 'application/json',
        // Add any API specific headers here
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Something went wrong'
    });
  }
};

// Example protected routes that proxy to your original API
router.get('/stocks/:symbol', protect, async (req, res) => {
  await proxyRequest(req, res, 'GET', `/stocks/${req.params.symbol}`);
});

router.get('/market-data', protect, async (req, res) => {
  await proxyRequest(req, res, 'GET', '/market-data');
});

// Get user's uploaded files
router.get('/user/files', protect, async (req, res) => {
  try {
    console.log('Fetching files for user:', req.user.id);
    const files = await File.find({ userId: req.user.id }).sort({ uploadDate: -1 });
    console.log('Found files:', files);
    res.json({ files });
  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

// Handle file upload
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = new File({
      filename: req.file.originalname,
      userId: req.user.id,
      uploadDate: new Date(),
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    await file.save();
    console.log('File saved:', file);

    res.status(201).json({ 
      message: 'File uploaded successfully',
      file: {
        filename: file.filename,
        uploadDate: file.uploadDate
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Add more routes as needed

module.exports = router; 