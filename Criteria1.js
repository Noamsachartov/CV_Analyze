


// Criterion 1: Resume language characteristics
function analyzeLanguage(cvText) {
    let score = 0;
    let totalSpecificityScore = 0;
    let totalActiveVoiceScore = 0;
    let totalCapitalLetterScore = 0;
    let totalFloweryScore = 0;
    let analysis = [];

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
        return /^[A-Z]/.test(word);
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

    return { score, totalSpecificityScore, totalActiveVoiceScore, totalCapitalLetterScore, totalFloweryScore, analysis };
}


let exampleCVText = `
PROFESSIONAL SUMMARY
Developed Manager with 4 years experience in tech companies, an entrepreneurial mindset, and passion for business and tech
Enjoyed team work around unclear, complex 20% environments while keeping a positive atmosphere
Managed an amazing product with $10M EBITDA annually, collaborated with more than 40 stakeholders - R&D and Business teams
`;

console.log(analyzeLanguage(exampleCVText));
