const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("pdf-parse");
const multer = require("multer");
const nodemailer = require('nodemailer');
const upload = multer();
const path = require("path");
var cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  console.log("user hit the resource");
  res.status(200).send("Home Page");
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'cvgeektech@gmail.com', // Your Gmail address
      pass: 'Danielle313!' // Your Gmail password
    }
  });

// API endpoint to handle PDF upload
app.post("/upload", upload.single("pdfFile"), async (req, res) => {
try{
    //console.log("Request body:", req.body); // Log request body
    //console.log("File:", req.file); // Log uploaded files

    if (!req.file) {
      return res.status(400).send({ message: "PDF file is required" });
    }

    //const pdfData = req.file.buffer;
    const pdfData = req.file;

    const proccessedPdf = await pdf(pdfData);
    
    console.log('pdf: ',proccessedPdf)
      // Setup email data with unicode symbols
    const mailOptions = {
        from: 'cvgeektech@gmail.com', // Sender address
        to: 'sachartov@gmail.com', // List of recipients
        subject: 'PDF File', // Subject line
        text: 'Please find attached PDF file', // Plain text body
        attachments: [
        {
            filename: proccessedPdf.originalname,
            content: proccessedPdf.buffer
        }
        ]
    };

transporter.sendMail(mailOptions, (error, info) => {
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
}catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});