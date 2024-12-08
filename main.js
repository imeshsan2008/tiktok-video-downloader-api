const { processTikTokVideo } = require('@imeshsan2008/fbdl');
const express = require('express');

const app = express();

// Endpoint to handle TikTok downloads
app.all('/download/tiktok', async (req, res) => {
    const apikey = req.method === 'POST' ? req.body.apikey : req.query.apikey;
    const url = req.method === 'POST' ? req.body.url : req.query.url;
    
    if (!apikey) {
        return res.status(400).json({ success: false, creator: 'imeshsan2008', error: 'Apikey is required' });
    }
    if (!url) {
        return res.status(400).json({ success: false, creator: 'imeshsan2008', error: 'URL is required' });
    }

    try {
        // Wait for the process to complete if it's asynchronous
        const result = await processTikTokVideo(url, apikey);

        // Check if result is null or undefined
        if (!result) {
            return res.status(500).json({ success: false, creator: 'imeshsan2008', error: 'Processing failed or returned no result' });
        }

        // Return the success response with additional fields
        return res.status(200).json({
            success: true,
            creator: 'imeshsan2008',
            result: result
        });
    } catch (error) {
        console.error('Error during processing:', error);
        return res.status(500).json({ success: false, creator: 'imeshsan2008', error: 'An error occurred while processing the request' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/download/tiktok?apikey=&url=`);
});
