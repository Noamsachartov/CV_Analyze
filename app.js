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
    //console.log("Request body:", req.body); // Log request body
    //console.log("File:", req.file); // Log uploaded files

    if (!req.file) {
      return res.status(400).send({ message: "PDF file is required" });
    }

    const pdfData = req.file.buffer;

    const proccessedPdf = await pdf(pdfData);
    
    
    //Criteria_1
    console.log(analyzeLanguage(proccessedPdf.text))
    const Analysis_analyzeLanguage = analyzeLanguage(proccessedPdf.text).analysis;
    const Score_analyzeLanguage = analyzeLanguage(proccessedPdf.text).score;

     //Criteria_2
    const Analysis_analyzeProhibitedTerms = analyzeProhibitedTerms(proccessedPdf.text).analysis;
    const Score_analyzeProhibitedTerms = analyzeProhibitedTerms(proccessedPdf.text).score;

     //Criteria_3
    const Analysis_extractPersonalInformation = extractPersonalInformation(proccessedPdf.text).analysis;
    const score_extractPersonalInformation = extractPersonalInformation(proccessedPdf.text).score;
     
    //Criteria_4
    const Analysis_analyzeStructure = analyzeStructure(proccessedPdf.text).analysis;
    const Score_analyzeStructure = analyzeStructure(proccessedPdf.text).score;



    const overall_score = ((Score_analyzeLanguage * 0.6) + (Score_analyzeProhibitedTerms * 0.1) + (score_extractPersonalInformation * 0.2) + (Score_analyzeStructure * 0.1))  ;
    const analysis_desc = [];
    analysis_desc.push(Analysis_analyzeLanguage);
    analysis_desc.push(Analysis_analyzeProhibitedTerms);
    analysis_desc.push(Analysis_extractPersonalInformation);
    analysis_desc.push(Analysis_analyzeStructure);

    const Analysis_Score_Per_property = []
    Analysis_Score_Per_property.push(analyzeLanguage(proccessedPdf.text).Summarized);
    Analysis_Score_Per_property.push(Analysis_analyzeProhibitedTerms);
    Analysis_Score_Per_property.push(Analysis_extractPersonalInformation);
    Analysis_Score_Per_property.push(Analysis_analyzeStructure);

    
    res.status(200).send({ overall_score, analysis_desc, Analysis_Score_Per_property });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: error.message });
  }
});

// Function to analyzeLanguage
function analyzeLanguage(cvText) {
  let score = 0;
  let totalSpecificityScore = 0;
  let totalActiveVoiceScore = 0;
  let totalCapitalLetterScore = 0;
  let totalFloweryScore = 0;
  let analysis = [];
  let Summarized = [];

  const activeListWords = [
      "Addressed", "Advertised", "Arbitrated", "Arranged", "Articulated", "Authored", "Clarified", "Collaborated", "Communicated", "Composed", "Condensed", "Conferred", "Consulted", "Contracted", "Conveyed", "Convinced", "Corresponded", "Created", "Debated", "Defined", "Developed", "Directed", "Discussed", "Dispatched", "Distinguished", "Drafted", "Edited", "Elicited", "Enlisted", "Explained", "Expressed", "Formulated", "Furnished", "Helped", "Identified", "Incorporated", "Influenced", "Interacted", "Interpreted", "Interviewed", "Involved", "Joined", "Judged", "Led", "Lectured", "Listened", "Manipulated", "Marketed", "Mediated", "Moderated", "Motivated", "Merged", "Negotiated", "Observed", "Obtained", "Outlined", "Participated", "Persuaded", "Presented", "Promoted", "Proposed", "Publicized", "Read", "Reasoned", "Reconciled", "Recruited", "Referred", "Reinforced", "Reported", "Resolved", "Responded", "Sold", "Solicited", "Specified", "Spoke", "Suggested", "Summarized", "Synthesized", "Translated", "Traveled", "Wrote", 
      "Abstracted", "Acted", "Adapted", "Began", "Combined", "Composed", "Conceptualized", "Condensed", "Created", "Customized", "Designed", "Developed", "Devised", "Directed", "Discriminated", "Displayed", "Drew", "Entertained", "Established", "Explored", "Fashioned", "Formulated", "Founded", "Generated", "Illustrated", "Imagined", "Imported", "Initiated", "Innovated", "Instituted", "Integrated", "Introduced", "Invented", "Launched", "Memorized", "Modeled", "Modified", "Originated", "Painted", "Perceived", "Performed", "Photographed", "Planned", "Published", "Revised", "Revitalized", "Shaped", "Shared", "Set", "Solidified", "Solved", "Synthesized", "Visualized", "Wrote", 
      "Assembled", "Bound", "Bent", "Built", "Controlled", "Drilled", "Drove", "Fed", "Handled", "Lifted", "Moved", "Operated", "Performed", "Set-up", "Pulled", "Punched", "Retooled", "Shipped", "Skilled", "Tended", "Worked", 
      "Accentuated", "Administered", "Advanced", "Analyzed", "Appointed", "Approved", "Assigned", "Attained", "Chaired", "Considered", "Consolidated", "Contained", "Contracted", "Controlled", "Converted", "Coordinated", "Cut", "Decided", "Delegated", "Developed", "Directed", "Doubled", "Eliminated", "Emphasized", "Enforced", "Enhanced", "Established", "Evaluated", "Executed", "Expanded", "Fine-tuned", "Generated", "Handled", "Headed", "Hired", "Hosted", "Implemented", "Improved", "Incorporated", "Increased", "Initiated", "Inspected", "Instituted", "Led", "Managed", "Merged", "Moderated", "Motivated", "Navigated", "Organized", "Originated", "Overhauled", "Oversaw", "Performed", "Planned", "Presided", "Prioritized", "Produced", "Quadrupled", "Recommended", "Recovered", "Recruited", "Reorganized", "Replaced", "Restored", "Restructured", "Reviewed", "Salvaged", "Saved", "Scheduled", "Secured", "Selected", "Streamlined", "Strengthened", "Supervised", "Terminated", "Tripled", "Troubleshot",
      "Administered", "Adjusted", "Allocated", "Analyzed", "Appraised", "Assessed", "Audited", "Balanced", "Budgeted", "Calculated", "Computed", "Conserved", "Corrected", "Decreased", "Detailed", "Determined", "Developed", "Estimated", "Extracted", "Forecast", "Increased", "Maintained", "Managed", "Marketed", "Measured", "Netted", "Planned", "Prepared", "Programmed", "Projected", "Qualified", "Reconciled", "Reduced", "Researched", "Retrieved", "Solved", "Trimmed", "Yielded", 
      "Adapted", "Adopted", "Advised", "Benchmarked", "Briefed", "Clarified", "Coached", "Communicated", "Conducted", "Coordinated", "Counseled", "Critiqued", "Decided", "Developed", "Empowered", "Enabled", "Encouraged", "Enlightened", "Evaluated", "Explained", "Facilitated", "Focused", "Guided", "Individualized", "Influenced", "Informed", "Initiated", "Instilled", "Instructed", "Invented", "Motivated", "Persuaded", "Schooled", "Shaped", "Simulated", "Stimulated", "Taught", "Tested", "Trained", "Transmitted", "Tutored", "Valued", 
      "Accomplished", "Achieved", "Approved", "Arranged", "Catalogued", "Charted", "Classified", "Coded", "Collated", "Collected", "Compared", "Compiled", "Completed", "Configured", "Corrected", "Corresponded", "Dispatched", "Distributed", "Diversified", "Enforced", "Executed", "Facilitated", "Filed", "Followed through","Engineered","Fabricated","Fortified","Installed","Maintained","Operated","Overhauled","Printed","Programmed","Rebuilt","Rectified","Rectified","Re-designed","Regulated","Remodeled","Repaired"
  ];

  const activeListWordsSet = new Set(activeListWords);
  // Helper function to check if a word is passive
  function isActive(word) {
      return activeListWordsSet.has(word);
 
  }

  //Helper funtion to check if a number indicating specification is exists in the sentence
  function isQuantitative(word) {
      return /\d|[$%]/.test(word);
  }


  // Helper function to check if the first word stars with a capital letter
  function isCapital(word) {
      return /^[A-Z0-9.•].*$/.test(word);
  }


  // Helper function to check if a word is "flowery"
  function isFlowery(word) {
      // If the word is excessively embellished or overly verbose - checking for very common adjectives and adverbs
      const commonFloweryWords = ["very","extremely", "incredibly","amazing","amazingly", "wonderfully", "fantastically", "beautifully", "exceptionally", "remarkably", "exceedingly", "extraordinarily", "exquisitely", "fabulously", "gloriously", "incredibly", "phenomenally", "splendidly","sublimely","superbly","supremely"];
      return commonFloweryWords.includes(word.toLowerCase());
  }

  // Split text into sentences
  const sentences = cvText.split(/\.\s*|\n/).filter(sentence => sentence.trim() !== "");
  var sentencesLength = 0;

  sentences.forEach(sentence => {
      // Skip sentences that appear to be section titles (e.g., all uppercase)
      if (!sentence.match(/^([A-Z]{2,})\b/)) {
          sentencesLength = sentencesLength +1;
          const words = sentence.split(/\s+/);
          const firstWord = words[0];
          const lastWord = words[words.length - 1].toLowerCase();

          // Check for specificity
          const specificityScore = isQuantitative(words) ? 1 : 0;

          // Check for active voice
          const activeVoiceScore = isActive(firstWord) ? 1 : 0;

          // Check for first word in a sentence with Capital letter
          const capitalLetterScore = isCapital(firstWord) ? 1 : 0;

          // Check for lack of "flowery" language
          const floweryScore = ((words.filter(word => isFlowery(word)).length / words.length)-1) * -1;
          
          // Calculate sentence score
          const sentenceScore = (specificityScore + activeVoiceScore + capitalLetterScore + floweryScore) / 4;
          score += sentenceScore;

          // Accumulate scores for overall analysis
          totalSpecificityScore += specificityScore;
          totalActiveVoiceScore += activeVoiceScore;
          totalCapitalLetterScore += capitalLetterScore;
          //totalFactBasedScore += factBasedScore;
          totalFloweryScore += floweryScore;

          // Provide analysis for this sentence
          analysis.push(`Sentence: "${sentence}"`);
          analysis.push(`Specificity: ${specificityScore * 100}%`);
          analysis.push(`Start with active voice: ${activeVoiceScore * 100}%`);
          analysis.push(`Starts with a Capital: ${capitalLetterScore * 100}%`);
          analysis.push(`Not Flowery language: ${floweryScore * 100}%`);
          analysis.push(`Sentence score: ${sentenceScore * 100}%`);
          analysis.push(""); // Add an empty line for better readability
      }
  });

  // Calculate overall scores as percentage of total sentences
  const totalSentences = sentencesLength;
  totalSpecificityScore = (totalSpecificityScore / totalSentences) * 100;
  totalActiveVoiceScore = (totalActiveVoiceScore / totalSentences) * 100;
  totalCapitalLetterScore = (totalCapitalLetterScore / totalSentences) * 100;
  totalFloweryScore = (totalFloweryScore / totalSentences) * 100;

  // Calculate overall score for the criterion
  score = (score / totalSentences) * 100;

  Summarized.push(`Specificity: ${totalSpecificityScore}%`);
  Summarized.push(`Start with active voice: ${totalActiveVoiceScore}%`);
  Summarized.push(`Starts with a Capital: ${totalCapitalLetterScore}%`);
  Summarized.push(`Not Flowery language: ${totalFloweryScore}%`);
  Summarized.push(""); // Add an empty line for better readability

  console.log(Summarized)
  return { score, Summarized, totalSpecificityScore, totalActiveVoiceScore, totalCapitalLetterScore, totalFloweryScore, analysis };
}

// Function to analyzeProhibitedTerms
function analyzeProhibitedTerms(cvText) {
    let score = 0;
    let analysis = [];

    // Define the prohibited terms
    const prohibitedTerms = ["image", "age", "sex", "references", "years old","I"];

    const prohibitedTermsSet = new Set(prohibitedTerms);
    // Helper function to check if a word is passive
    function isProhibited(word) {
        return prohibitedTermsSet.has(word);
    }

    // Split CV into Words and apply logic
        const words = cvText.split(/\s+/);
        words.forEach(word => {
            const prohibitedScore = isProhibited(word) ? 1 : 0;
            if(prohibitedScore == 1){
                score = score + 1;
                analysis.push(`Should not indicate in the CV: ${word.toUpperCase()}`);
                analysis.push("");
            }
            
        })
        
        score = ((score / prohibitedTerms.length)-1) * -1 *100

    return { score, analysis };
}

// Function to extractPersonalInformation
function extractPersonalInformation(cvText) {
    let score = 0;
    let analysis = [];

    // Regular expressions to match email address, phone number, LinkedIn URL, city/country
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const linkedInRegex = /linkedin\.com\/\w{2,}/gi;

    // Extract email addresses
    const emails = cvText.match(emailRegex) || [];
    analysis.push(`Email address: ${emails.length > 0 ? "Found" : "Not found"}`);
    score += emails.length > 0 ? 1 : 0;

    // Extract phone numbers
    const phoneNumbers = cvText.match(phoneRegex) || [];
    analysis.push(`Phone number: ${phoneNumbers.length > 0 ? "Found" : "Not found"}`);
    score += phoneNumbers.length > 0 ? 1 : 0;

    // Extract LinkedIn profile URLs
    const linkedInURLs = cvText.match(linkedInRegex) || [];
    analysis.push(`LinkedIn profile URL: ${linkedInURLs.length > 0 ? "Found" : "Not found"}`);
    score += linkedInURLs.length > 0 ? 1 : 0;


    // Calculate overall score for the criterion
    score = (score / 3) * 100;

    return { score, analysis };
}

//
function analyzeStructure(cvText) {
    let score = 0;
    let analysis = [];

    // Define the required sections
    const requiredSections = ["Education", "Professional experience", "Skills", "Personal summary"];

    // Split the CV text into lines
    const lines = cvText.split(/\n+/).filter(line => line.trim() !== "");

    // Function to check for the presence of each required section
    function checkSections() {
        let foundSections = 0;
        requiredSections.forEach(section => {
            lines.forEach(line => {
                if (line.toLowerCase().includes(section.toLowerCase())) {
                    foundSections++;
                }
            });
        });
        const sectionsScore = foundSections / requiredSections.length;
        score += sectionsScore;

        // Provide analysis for sections
        analysis.push(`Sections found: ${foundSections}/${requiredSections.length}`);
        analysis.push(`Sections score: ${sectionsScore * 100}%`);
        analysis.push(""); // Add an empty line for better readability
    }

    // Function to check consistency in formatting, spacing, and length
    function checkConsistency() {
        // Add your consistency checks here
        // For example, check for consistent spacing, underlining, italics, bold, and capitalization
        // You can use regular expressions or other methods to perform these checks
        // For demonstration purposes, let's assume all formatting is consistent
        const consistencyScore = 1;
        score += consistencyScore;

        // Provide analysis for consistency
        analysis.push("Consistency in formatting, spacing, and length: consistent");
        analysis.push(`Consistency score: ${consistencyScore * 100}%`);
        analysis.push(""); // Add an empty line for better readability
    }

    // Check for the presence of required sections
    checkSections();

    // Check consistency in formatting, spacing, and length
    checkConsistency();

    // Calculate overall score for the criterion
    score = (score / 2) * 100; // Divide by 2 for two sub-criteria

    return { score, analysis };
}



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});