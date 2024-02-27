const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("pdf-parse");
const multer = require("multer");
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

// API endpoint to handle PDF upload
app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request body
    console.log("File:", req.file); // Log uploaded files

    if (!req.file) {
      return res.status(400).send({ message: "PDF file is required" });
    }

    const pdfData = req.file.buffer;
    const actionWord = "React"; // Action word to count
    //Later I will add more logic here to scan on the PDF file

    const proccessedPdf = await pdf(pdfData);
    //
    //console.log("proccessedPdf:", proccessedPdf.text)
    //const Score1 = analyzeCV(proccessedPdf.text)
    var textforfunc = "partnered and linkedin developed directed executed was were"
    const Final_analysis = analyzeCV(proccessedPdf.text)
    console.log((await Final_analysis).overallscore)
    const overall_score = (await Final_analysis).overallscore
    const analysis_desc = (await Final_analysis).analysis
    

    //
    //const count = countActionWord(proccessedPdf.text, actionWord);
    //res.status(200).send({ count });
    res.status(200).send({ overall_score,analysis_desc });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: error.message });
  }
});

// Function to extract text from PDF
async function extractTextFromPDF(pdfData) {
  return new Promise((resolve, reject) => {
    PDFParser.pdf2text(pdfData, function (error, data) {
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
  const regex = new RegExp(`\\b${actionWord}\\b`, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

// Function to analyze the CV text
async function analyzeCV(cvText) {
    let score = 0;
    let analysis = [];

    // Criterion 1: Resume language characteristics
    const specificWords = ["partnered", "developed", "directed", "executed", "motivated", "improved", "conducted", "guided"];
    const passiveWords = ["was", "were", "been"];
    const factBasedWords = ["20%", "10%", "5%", "12%"];
    let specificCount = 0;
    let passiveCount = 0;
    let factBasedCount = 0;
    let totalWords = cvText.split(/\s+/).length;

    specificWords.forEach(word => {
        specificCount += (cvText.match(new RegExp("\\b" + word + "\\b", 'gi')) || []).length;
    });
    passiveWords.forEach(word => {
        passiveCount += (cvText.match(new RegExp("\\b" + word + "\\b", 'gi')) || []).length;
    });
    factBasedWords.forEach(word => {
        factBasedCount += (cvText.match(new RegExp("\\b" + word + "\\b", 'gi')) || []).length;
    });

    const specificScore = specificCount / totalWords;
    const passiveScore = 1 - (passiveCount / totalWords);
    const factBasedScore = factBasedCount / totalWords;

    analysis.push(`Resume language should be specific rather than general: ${specificScore}`);
    analysis.push(`Resume language should be active rather than passive: ${passiveScore}`);
    analysis.push(`Resume language should be fact-based: ${factBasedScore}`);
    
    score += (specificScore + passiveScore + factBasedScore) / 3;

    // Criterion 2: Prohibited terms
    const prohibitedTerms = ["image", "age", "sex", "references"];
    let prohibitedCount = 0;
    prohibitedTerms.forEach(term => {
        prohibitedCount += (cvText.match(new RegExp("\\b" + term + "\\b", 'gi')) || []).length;
    });
    const prohibitedScore = 1 - (prohibitedCount / totalWords);
    analysis.push(`Prohibited terms should not be included: ${prohibitedScore}`);
    score += prohibitedScore;

    // Criterion 3: Personal information
    const requiredPersonalInfo = ["email", "phone", "linkedin", "city", "country"];
    let personalInfoScore = 0;
    requiredPersonalInfo.forEach(info => {
        if (cvText.toLowerCase().includes(info)) {
            personalInfoScore += 1 / requiredPersonalInfo.length;
        }
    });
    analysis.push(`Personal information provided: ${personalInfoScore}`);
    score += personalInfoScore;

    // Criterion 4: Structure
    // Implement structure analysis here
    //console.log("score:" (score / 4) * 100, analysis)
    const overallscore = (score / 4) * 100
    //console.log("overallscore:"+overallscore,analysis)
    return {overallscore, analysis };
}



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});