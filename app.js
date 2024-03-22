const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("pdf-parse");
const multer = require("multer");
const nodemailer = require('nodemailer');
//const upload = multer();
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


// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'cvgeektech@gmail.com', // Your Gmail address
      pass: 'Danielle313!' // Your Gmail password
    }
  });

// API endpoint to handle PDF upload
// Route to handle file upload
app.post('/upload', upload.single('pdf'), (req, res) => {
    const pdf = req.file;
  
    // Check if a PDF file was uploaded
    if (!pdf) {
      return res.status(400).send('No PDF file uploaded');
    }
  
    // Extract form inputs
    const fullname = req.body.fullname;
    const email = req.body.email;
    const description = req.body.description;
  
    // Setup email data with form inputs
    const mailOptions = {
      from: 'cvgeektech@gmail.com', // Sender address
      to: 'sachartov@gmail.com', // List of recipients
      subject: 'File Upload', // Subject line
      html: `
        <p><strong>Full Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p>Please find attached PDF file</p>
      `,
      attachments: [
        {
          filename: pdf.originalname,
          content: pdf.buffer, // Attach the buffer directly
          contentType: 'application/pdf' // Specify the content type
        }
      ]
    };
  
    // Send email with attached PDF and form inputs
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error.message);
        return res.status(500).send('Failed to send email');
      }
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    });
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});