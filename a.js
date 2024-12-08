const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // For generating API keys
const { MongoClient } = require('mongodb');

// Create an Express app
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const mongoURL = 'mongodb+srv://imeshsan2008:Imeshsandeepa018@cluster0.sirdt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'apisite';

MongoClient.connect(mongoURL)
    .then(client => {
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });


    app.all('/generate-api', (req, res) => {
        const username = req.method === 'POST' ? req.body.username : req.query.username;
    
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
    
        const apikey = crypto.randomBytes(16).toString('hex');
        const usersCollection = db.collection('users');
    
        usersCollection.insertOne({ username, apikey })
            .then(result => {
                res.json({ username, apikey });
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: 'Failed to generate API key' });
            });
    });
    

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
