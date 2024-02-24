const express = require('express');
const bodyParser = require('body-parser');
const PDFParser = require('pdf-parse');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    console.log('user hit the resource')
    res.status(200).send('Home Page')
  })

// API endpoint to handle PDF upload
app.post('/upload', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log request body
        console.log('Files:', req.files); // Log uploaded files

        if (!req.files || !req.files.pdfFile) {
            return res.status(400).send({ message: 'PDF file is required' });
        }

        const pdfData = req.files.pdfFile.data;
        const actionWord = 'run'; // Action word to count
        //Later I will add more logic here to scan on the PDF file

        const text = await extractTextFromPDF(pdfData);
        const count = countActionWord(text, actionWord);

        res.status(200).send({ count });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message });
    }
});



// Function to extract text from PDF
async function extractTextFromPDF(pdfData) {
    return new Promise((resolve, reject) => {
        PDFParser.pdf2text(pdfData, function(error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

// Function to count occurrences of an action word in text
function countActionWord(text, actionWord) {
    const regex = new RegExp(`\\b${actionWord}\\b`, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
