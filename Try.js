const express = require('express');
const app = express();

// Function to analyze the CV text
function analyzeCV(cvText) {
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
    
    return { score: (score / 4) * 100, analysis };
}

// Endpoint to receive CV text and return analysis
app.post('/analyze-cv', (req, res) => {
    let cvText = req.body.cvText; // Assuming the CV text is sent in the request body
    let result = analyzeCV(cvText);
    res.json(result);
});

// Example usage
let exampleCVText = `
    // CV text goes here
`;

console.log(analyzeCV(exampleCVText));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});






// Criteria:
// 1.  Resume language should be: 
// - Specific rather then general
// - Active rather passive
// - Fact based (quantify and qualify) 

// 2. Should not include:
// - Abbreviate
// - should not include image, age or sex, list references

// 3. Personal information needed:
// - Email address, phone number, linkedIn profile URL, City/country of resident

// 4. Structure:
// - Should include the following section - Education, Professional experience, Skills, personal summary 
// - Use consistent spacing, underlining, italics, bold, and capitalization for emphasis.
// - not more then one page.



//////

//cretieria 1:

// Criterion 1: Resume language characteristics
function analyzeLanguage(cvText) {
    let score = 0;
    let analysis = [];

    // Helper function to check if a word is passive
    function isPassive(word) {
        return word === "is" || word === "was" || word === "were" || word === "been";
    }

    // Helper function to check if a word is "flowery"
    function isFlowery(word) {
        // You can define your own criteria for "flowery" language
        // For example, if the word is excessively embellished or overly verbose
        // Here, we're just checking for very common adjectives and adverbs
        const commonFloweryWords = ["very", "extremely", "incredibly", "amazingly", "wonderfully", "fantastically", "beautifully", "exceptionally", "remarkably"];
        return commonFloweryWords.includes(word.toLowerCase());
    }

    // Split text into sentences assuming sentence ends in a period or in a new line. 
    const sentences = cvText.split(/\.\s*|\n/).filter(sentence => sentence.trim() !== "");

    sentences.forEach(sentence => {
        // Skip sentences that appear to be section titles (e.g., all uppercase)
        if (!sentence.match(/[A-Z]{2,}/)) {
            const words = sentence.split(/\s+/);
            const firstWord = words[0].toLowerCase();
            const lastWord = words[words.length - 1].toLowerCase();

            // Check for specificity
            const specificWordCount = words.filter(word => !["and", "or", "the", "a", "an", "of"].includes(word.toLowerCase())).length;
            const specificityScore = specificWordCount > 1 ? 1 : 0;

            // Check for active voice
            const activeVoiceScore = !isPassive(firstWord) ? 1 : 0;

            // Check for fact-based language
            const factBasedScore = specificWordCount > 1 ? 1 : 0;

            // Check for lack of "flowery" language
            const floweryScore = !isFlowery(firstWord) && !isFlowery(lastWord) ? 1 : 0;

            // Calculate sentence score
            const sentenceScore = (specificityScore + activeVoiceScore + factBasedScore + floweryScore) / 4;
            score += sentenceScore;

            // Provide analysis for this sentence
            analysis.push(`Sentence: "${sentence}"`);
            analysis.push(`Specificity: ${specificityScore}`);
            analysis.push(`Active voice: ${activeVoiceScore}`);
            analysis.push(`Fact-based: ${factBasedScore}`);
            analysis.push(`Flowery language: ${floweryScore}`);
            analysis.push(`Sentence score: ${sentenceScore}`);
            analysis.push(""); // Add an empty line for better readability
        }
    });

    return { score: (score / sentences.length) * 100, analysis };
}


console.log(analyzeLanguage(exampleCVText));



////


// Criterion 1: Resume language characteristics
function analyzeLanguage(cvText) {
    let score = 0;
    let totalSpecificityScore = 0;
    let totalActiveVoiceScore = 0;
    let totalFactBasedScore = 0;
    let totalFloweryScore = 0;
    let analysis = [];

    // Helper function to check if a word is passive
    function isPassive(word) {
        return word === "is" || word === "was" || word === "were" || word === "been";
    }

    // Helper function to check if a word is "flowery"
    function isFlowery(word) {
        // You can define your own criteria for "flowery" language
        // For example, if the word is excessively embellished or overly verbose
        // Here, we're just checking for very common adjectives and adverbs
        const commonFloweryWords = ["very", "extremely", "incredibly", "amazingly", "wonderfully", "fantastically", "beautifully", "exceptionally", "remarkably"];
        return commonFloweryWords.includes(word.toLowerCase());
    }

    // Split text into sentences
    const sentences = cvText.split(/\.\s*|\n/).filter(sentence => sentence.trim() !== "");

    sentences.forEach(sentence => {
        // Skip sentences that appear to be section titles (e.g., all uppercase)
        if (!sentence.match(/[A-Z]{2,}/)) {
            const words = sentence.split(/\s+/);
            const firstWord = words[0].toLowerCase();
            const lastWord = words[words.length - 1].toLowerCase();

            // Check for specificity
            const specificWordCount = words.filter(word => !["and", "or", "the", "a", "an", "of"].includes(word.toLowerCase())).length;
            const specificityScore = specificWordCount / words.length;

            // Check for active voice
            const activeVoiceScore = isPassive(firstWord) ? 0 : 1;

            // Check for fact-based language
            const factBasedScore = specificWordCount / words.length;

            // Check for lack of "flowery" language
            const floweryScore = (words.filter(word => isFlowery(word)).length / words.length) * -1;

            // Calculate sentence score
            const sentenceScore = (specificityScore + activeVoiceScore + factBasedScore + floweryScore) / 4;
            score += sentenceScore;

            // Accumulate scores for overall analysis
            totalSpecificityScore += specificityScore;
            totalActiveVoiceScore += activeVoiceScore;
            totalFactBasedScore += factBasedScore;
            totalFloweryScore += floweryScore;

            // Provide analysis for this sentence
            analysis.push(`Sentence: "${sentence}"`);
            analysis.push(`Specificity: ${specificityScore * 100}%`);
            analysis.push(`Active voice: ${activeVoiceScore * 100}%`);
            analysis.push(`Fact-based: ${factBasedScore * 100}%`);
            analysis.push(`Flowery language: ${floweryScore * 100}%`);
            analysis.push(`Sentence score: ${sentenceScore * 100}%`);
            analysis.push(""); // Add an empty line for better readability
        }
    });

    // Calculate overall scores as percentage of total sentences
    const totalSentences = sentences.length;
    totalSpecificityScore = (totalSpecificityScore / totalSentences) * 100;
    totalActiveVoiceScore = (totalActiveVoiceScore / totalSentences) * 100;
    totalFactBasedScore = (totalFactBasedScore / totalSentences) * 100;
    totalFloweryScore = (totalFloweryScore / totalSentences) * 100;

    // Calculate overall score for the criterion
    score = (score / totalSentences) * 100;

    return { score, totalSpecificityScore, totalActiveVoiceScore, totalFactBasedScore, totalFloweryScore, analysis };
}


console.log(analyzeLanguage(exampleCVText));
