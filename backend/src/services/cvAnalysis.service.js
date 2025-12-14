
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const pdfParse = require('pdf-parse'); // ← Correct import
// const axios = require('axios');

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// /**
//  * Download file from URL
//  */
// async function downloadFile(url) {
//   try {
//     console.log('Downloading file from:', url);

//     const response = await axios.get(url, { 
//       responseType: 'arraybuffer',
//       timeout: 30000,
//       headers: {
//         'User-Agent': 'Mozilla/5.0'
//       }
//     });
    
//     console.log('✅ File downloaded successfully');
//     return Buffer.from(response.data);
//   } catch (error) {
//     console.error('Download error:', error.message);
//     throw new Error(`Failed to download file: ${error.message}`);
//   }
// }

// /**
//  * Extract text from PDF
//  */
// async function extractTextFromPDF(buffer) {
//   try {
//     console.log('📄 Extracting text from PDF...');
//     const data = await pdfParse(buffer); // ← Correct usage
//     console.log(`✅ Extracted ${data.text.length} characters`);
//     return data.text;
//   } catch (error) {
//     console.error('PDF parsing error:', error);
//     throw new Error(`Failed to parse PDF: ${error.message}`);
//   }
// }

// /**
//  * Analyze CV using Google Gemini
//  */
// async function analyzeCVWithAI(cvText) {
//   try {
//     console.log('🤖 Analyzing CV with Google Gemini AI...');
    
//     // Use the exact model name from Google AI Studio
//     const model = genAI.getGenerativeModel({ 
//       model: 'gemini-flash-latest'  // ← Changed to match AI Studio
//     });

//     const prompt = `
// You are an expert CV/Resume analyzer. Analyze the following CV and provide a detailed assessment in JSON format.

// CV Content:
// ${cvText.substring(0, 8000)}

// Provide your analysis in the following JSON structure (respond ONLY with valid JSON, no markdown or explanations):
// {
//   "overallScore": <number 0-100>,
//   "strengths": [<array of 3-5 key strengths as strings>],
//   "weaknesses": [<array of 3-5 areas for improvement as strings>],
//   "recommendations": [<array of 3-5 specific actionable recommendations as strings>],
//   "skillsDetected": [<array of all technical and professional skills found as strings>],
//   "extractedData": {
//     "experience": "<brief summary of work experience>",
//     "education": [<array of educational qualifications as strings>],
//     "certifications": [<array of certifications if any as strings>],
//     "languages": [<array of languages mentioned as strings>],
//     "totalYearsExperience": <estimated total years as a number>
//   },
//   "detailedAnalysis": {
//     "formatting": "<assessment of CV structure and formatting>",
//     "content": "<assessment of content quality>",
//     "keywords": "<assessment of industry-relevant keywords>",
//     "atsCompatibility": "<assessment of ATS compatibility>"
//   }
// }

// Important:
// - Be specific and actionable in recommendations
// - Extract ALL skills mentioned (technical, soft skills, tools, technologies)
// - Provide realistic overall score
// - Return ONLY valid JSON, no markdown
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let text = response.text();

//     console.log('📊 AI Response received');

//     // Clean response
//     text = text.trim();
//     if (text.startsWith('```json')) {
//       text = text.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
//     } else if (text.startsWith('```')) {
//       text = text.replace(/```\n?/g, '');
//     }

//     const analysis = JSON.parse(text);

//     if (typeof analysis.overallScore !== 'number' || !Array.isArray(analysis.skillsDetected)) {
//       throw new Error('Invalid analysis format');
//     }

//     console.log('✅ AI Analysis completed');
//     console.log(`   Score: ${analysis.overallScore}/100`);
//     console.log(`   Skills: ${analysis.skillsDetected.length}`);

//     return analysis;

//   } catch (error) {
//     console.error('❌ AI Error:', error.message);
//     throw new Error(`AI analysis failed: ${error.message}`);
//   }
// }
// /**
//  * Main CV Analysis Function
//  */
// async function performCVAnalysis(cvFileUrl) {
//   try {
//     console.log('\n🚀 Starting CV Analysis Process');
//     console.log('CV URL:', cvFileUrl);

//     // Step 1: Download
//     const fileBuffer = await downloadFile(cvFileUrl);
//     console.log(`📦 File downloaded: ${fileBuffer.length} bytes`);

//     // Step 2: Extract text
//     const cvText = await extractTextFromPDF(fileBuffer);

//     if (!cvText || cvText.trim().length < 100) {
//       throw new Error('Could not extract sufficient text from CV. The PDF may contain scanned images.');
//     }

//     console.log(`📝 Extracted text: ${cvText.length} characters`);

//     // Step 3: AI Analysis
//     const analysis = await analyzeCVWithAI(cvText);

//     console.log('✅ CV Analysis completed successfully\n');

//     return {
//       success: true,
//       analysis
//     };

//   } catch (error) {
//     console.error('❌ CV Analysis Failed:', error.message);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// module.exports = {
//   performCVAnalysis,
//   analyzeCVWithAI,
//   extractTextFromPDF,
//   downloadFile
// };

const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const axios = require('axios');

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
    const data = await pdfParse(buffer);
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
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest'
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
 * Main CV Analysis Function with Progress Callback
 * @param {String} cvFileUrl - URL of the CV file
 * @param {Function} onProgress - Callback function for progress updates
 */
async function performCVAnalysis(cvFileUrl, onProgress) {
  try {
    console.log('\n🚀 Starting CV Analysis Process');
    console.log('CV URL:', cvFileUrl);

    // Step 1: Download (20-40%)
    if (onProgress) {
      onProgress({
        status: 'processing',
        progress: 30,
        message: 'Downloading CV file...',
        step: 'download'
      });
    }

    const fileBuffer = await downloadFile(cvFileUrl);
    console.log(`📦 File downloaded: ${fileBuffer.length} bytes`);

    // Step 2: Extract text (40-60%)
    if (onProgress) {
      onProgress({
        status: 'processing',
        progress: 50,
        message: 'Extracting text from PDF...',
        step: 'extract'
      });
    }

    const cvText = await extractTextFromPDF(fileBuffer);

    if (!cvText || cvText.trim().length < 100) {
      throw new Error('Could not extract sufficient text from CV. The PDF may contain scanned images.');
    }

    console.log(`📝 Extracted text: ${cvText.length} characters`);

    // Step 3: AI Analysis (60-75%)
    if (onProgress) {
      onProgress({
        status: 'processing',
        progress: 65,
        message: 'AI is analyzing your CV... This may take 30-60 seconds.',
        step: 'ai-analysis'
      });
    }

    const analysis = await analyzeCVWithAI(cvText);

    console.log('✅ CV Analysis completed successfully\n');

    if (onProgress) {
      onProgress({
        status: 'processing',
        progress: 75,
        message: 'Analysis complete! Processing results...',
        step: 'complete-analysis'
      });
    }

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