// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const pdfParse = require('pdf-parse');
// const axios = require('axios');

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// /**
//  * Download file from URL
//  */
// async function downloadFile(url) {
//   try {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     return Buffer.from(response.data);
//   } catch (error) {
//     throw new Error(`Failed to download file: ${error.message}`);
//   }
// }

// /**
//  * Extract text from PDF
//  */
// async function extractTextFromPDF(buffer) {
//   try {
//     const data = await pdfParse(buffer);
//     return data.text;
//   } catch (error) {
//     throw new Error(`Failed to parse PDF: ${error.message}`);
//   }
// }

// /**
//  * Analyze CV using Google Gemini
//  */
// async function analyzeCVWithAI(cvText) {
//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//     const prompt = `
// You are an expert CV/Resume analyzer. Analyze the following CV and provide a detailed assessment in JSON format.

// CV Content:
// ${cvText}

// Provide your analysis in the following JSON structure (respond ONLY with valid JSON, no markdown or explanations):
// {
//   "overallScore": <number 0-100>,
//   "strengths": [<array of 3-5 key strengths>],
//   "weaknesses": [<array of 3-5 areas for improvement>],
//   "recommendations": [<array of 3-5 specific recommendations>],
//   "skillsDetected": [<array of all technical and professional skills found>],
//   "extractedData": {
//     "experience": "<brief summary of work experience>",
//     "education": [<array of educational qualifications>],
//     "certifications": [<array of certifications if any>],
//     "languages": [<array of languages mentioned>],
//     "totalYearsExperience": <estimated total years as a number>
//   },
//   "detailedAnalysis": {
//     "formatting": "<assessment of CV structure and formatting>",
//     "content": "<assessment of content quality>",
//     "keywords": "<assessment of industry-relevant keywords>",
//     "atsCompatibility": "<assessment of ATS (Applicant Tracking System) compatibility>"
//   }
// }

// Important:
// - Be specific and actionable in recommendations
// - Extract ALL skills mentioned (technical, soft skills, tools, technologies)
// - Provide realistic overall score based on content quality, formatting, and completeness
// - Estimate years of experience from job history
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     // Clean up response (remove markdown code blocks if present)
//     let cleanedText = text.trim();
//     if (cleanedText.startsWith('```json')) {
//       cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
//     } else if (cleanedText.startsWith('```')) {
//       cleanedText = cleanedText.replace(/```\n?/g, '');
//     }

//     // Parse JSON
//     const analysis = JSON.parse(cleanedText);

//     // Validate required fields
//     if (!analysis.overallScore || !analysis.skillsDetected) {
//       throw new Error('Invalid analysis format from AI');
//     }

//     return analysis;

//   } catch (error) {
//     console.error('AI Analysis Error:', error);
//     throw new Error(`AI analysis failed: ${error.message}`);
//   }
// }

// /**
//  * Main CV Analysis Function
//  */
// async function performCVAnalysis(cvFileUrl) {
//   try {
//     // Step 1: Download CV file
//     console.log('Downloading CV from:', cvFileUrl);
//     const fileBuffer = await downloadFile(cvFileUrl);

//     // Step 2: Extract text from PDF
//     console.log('Extracting text from PDF...');
//     const cvText = await extractTextFromPDF(fileBuffer);

//     if (!cvText || cvText.trim().length < 100) {
//       throw new Error('Could not extract sufficient text from CV. Please ensure the CV is text-based, not scanned images.');
//     }

//     // Step 3: Analyze with AI
//     console.log('Analyzing CV with AI...');
//     const analysis = await analyzeCVWithAI(cvText);

//     return {
//       success: true,
//       analysis
//     };

//   } catch (error) {
//     console.error('CV Analysis Error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// module.exports = {
//   performCVAnalysis,
//   analyzeCVWithAI,
//   extractTextFromPDF
// };

const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse'); // ← Correct import
const axios = require('axios');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Download file from URL
 */
async function downloadFile(url) {
  try {
    console.log('Downloading file from:', url);

    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    console.log('✅ File downloaded successfully');
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Download error:', error.message);
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(buffer) {
  try {
    console.log('📄 Extracting text from PDF...');
    const data = await pdfParse(buffer); // ← Correct usage
    console.log(`✅ Extracted ${data.text.length} characters`);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Analyze CV using Google Gemini
 */
async function analyzeCVWithAI(cvText) {
  try {
    console.log('🤖 Analyzing CV with Google Gemini AI...');
    
    // Use the exact model name from Google AI Studio
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest'  // ← Changed to match AI Studio
    });

    const prompt = `
You are an expert CV/Resume analyzer. Analyze the following CV and provide a detailed assessment in JSON format.

CV Content:
${cvText.substring(0, 8000)}

Provide your analysis in the following JSON structure (respond ONLY with valid JSON, no markdown or explanations):
{
  "overallScore": <number 0-100>,
  "strengths": [<array of 3-5 key strengths as strings>],
  "weaknesses": [<array of 3-5 areas for improvement as strings>],
  "recommendations": [<array of 3-5 specific actionable recommendations as strings>],
  "skillsDetected": [<array of all technical and professional skills found as strings>],
  "extractedData": {
    "experience": "<brief summary of work experience>",
    "education": [<array of educational qualifications as strings>],
    "certifications": [<array of certifications if any as strings>],
    "languages": [<array of languages mentioned as strings>],
    "totalYearsExperience": <estimated total years as a number>
  },
  "detailedAnalysis": {
    "formatting": "<assessment of CV structure and formatting>",
    "content": "<assessment of content quality>",
    "keywords": "<assessment of industry-relevant keywords>",
    "atsCompatibility": "<assessment of ATS compatibility>"
  }
}

Important:
- Be specific and actionable in recommendations
- Extract ALL skills mentioned (technical, soft skills, tools, technologies)
- Provide realistic overall score
- Return ONLY valid JSON, no markdown
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('📊 AI Response received');

    // Clean response
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(text);

    if (typeof analysis.overallScore !== 'number' || !Array.isArray(analysis.skillsDetected)) {
      throw new Error('Invalid analysis format');
    }

    console.log('✅ AI Analysis completed');
    console.log(`   Score: ${analysis.overallScore}/100`);
    console.log(`   Skills: ${analysis.skillsDetected.length}`);

    return analysis;

  } catch (error) {
    console.error('❌ AI Error:', error.message);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}
/**
 * Main CV Analysis Function
 */
async function performCVAnalysis(cvFileUrl) {
  try {
    console.log('\n🚀 Starting CV Analysis Process');
    console.log('CV URL:', cvFileUrl);

    // Step 1: Download
    const fileBuffer = await downloadFile(cvFileUrl);
    console.log(`📦 File downloaded: ${fileBuffer.length} bytes`);

    // Step 2: Extract text
    const cvText = await extractTextFromPDF(fileBuffer);

    if (!cvText || cvText.trim().length < 100) {
      throw new Error('Could not extract sufficient text from CV. The PDF may contain scanned images.');
    }

    console.log(`📝 Extracted text: ${cvText.length} characters`);

    // Step 3: AI Analysis
    const analysis = await analyzeCVWithAI(cvText);

    console.log('✅ CV Analysis completed successfully\n');

    return {
      success: true,
      analysis
    };

  } catch (error) {
    console.error('❌ CV Analysis Failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  performCVAnalysis,
  analyzeCVWithAI,
  extractTextFromPDF,
  downloadFile
};