// Criterion 2: Prohibited terms
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

// Example usage
let exampleCVText = `
Noam, age 26 years old, and counting. I worked there for 20 years.
`;

console.log(analyzeProhibitedTerms(exampleCVText));




