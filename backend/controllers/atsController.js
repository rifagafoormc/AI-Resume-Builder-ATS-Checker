// backend/src/controllers/atsController.js

const ATSAnalysis = require("../models/ATSAnalysis");
const Resume = require("../models/Resume");
const mammoth = require("mammoth");
const { GoogleGenAI } = require("@google/genai");

// =========================================================
// GEMINI INITIALIZATION
// =========================================================

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    // Load dotenv if API key is not already available
    if (!process.env.GEMINI_API_KEY) {
      try {
        require("dotenv").config();
        console.log("📝 .env loaded by atsController.js");
      } catch (envError) {
        console.warn(
          "⚠️ Could not load .env:",
          envError.message
        );
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "❌ GEMINI_API_KEY not found in environment"
      );

      throw new Error(
        "GEMINI_API_KEY is not set in environment variables. Please check your .env file."
      );
    }

    console.log(
      "🔑 Gemini API Key found:",
      process.env.GEMINI_API_KEY.substring(0, 10) + "..."
    );

    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    console.log("✅ Gemini initialized successfully");
  }

  return genAI;
};

// =========================================================
// EXTRACT TEXT FROM NON-PDF FILES
// =========================================================

const extractTextFromFile = async (file) => {
  const ext = file.originalname
    .split(".")
    .pop()
    .toLowerCase();

  // ---------------------------------------------------------
  // DOCX
  // ---------------------------------------------------------

  if (ext === "docx") {
    try {
      const result = await mammoth.extractRawText({
        buffer: file.buffer
      });

      const extractedText = result.value || "";

      console.log(
        "✅ Successfully extracted from DOCX"
      );

      console.log(
        "📄 Extracted DOCX text length:",
        extractedText.length
      );

      if (!extractedText.trim()) {
        throw new Error(
          "DOCX file contains no readable text."
        );
      }

      return extractedText;
    } catch (error) {
      console.error(
        "❌ DOCX extraction failed:",
        error.message
      );

      throw new Error(
        "Could not extract text from DOCX file."
      );
    }
  }

  // ---------------------------------------------------------
  // LEGACY DOC
  // ---------------------------------------------------------

  if (ext === "doc") {
    throw new Error(
      "Legacy .doc files are not supported. Please upload PDF, DOCX, or TXT."
    );
  }

  // ---------------------------------------------------------
  // TXT
  // ---------------------------------------------------------

  if (ext === "txt") {
    const extractedText =
      file.buffer.toString("utf-8");

    console.log(
      "✅ Successfully extracted from TXT"
    );

    console.log(
      "📄 Extracted TXT text length:",
      extractedText.length
    );

    if (!extractedText.trim()) {
      throw new Error("TXT file is empty.");
    }

    return extractedText;
  }

  // ---------------------------------------------------------
  // PDF
  // ---------------------------------------------------------

  if (ext === "pdf") {
    // PDF is sent directly to Gemini.
    return null;
  }

  throw new Error(
    "Unsupported file type. Please upload PDF, DOCX, or TXT."
  );
};

// =========================================================
// ANALYZE UPLOADED RESUME
// PDF / DOCX / TXT
// =========================================================

const analyzeUploadedResume = async (req, res) => {
  try {
    // -------------------------------------------------------
    // CHECK FILE
    // -------------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required"
      });
    }

    // -------------------------------------------------------
    // CHECK JOB DESCRIPTION
    // -------------------------------------------------------

    const { jobDescription } = req.body;

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Job description is required"
      });
    }

    // -------------------------------------------------------
    // GET GEMINI
    // -------------------------------------------------------

    let gemini;

    try {
      gemini = getGenAI();
    } catch (initError) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured",
        error: initError.message,
        hint:
          "Make sure GEMINI_API_KEY is set in your .env file"
      });
    }

    // -------------------------------------------------------
    // FILE TYPE
    // -------------------------------------------------------

    const ext = req.file.originalname
      .split(".")
      .pop()
      .toLowerCase();

    console.log(
      "📄 Uploaded file:",
      req.file.originalname
    );

    console.log(
      "📄 File type:",
      ext
    );

    console.log(
      "📄 File size:",
      req.file.size,
      "bytes"
    );

    // =======================================================
    // BUILD GEMINI CONTENT
    // =======================================================

    let contents;

    // =======================================================
    // PDF
    // =======================================================

    if (ext === "pdf") {
      console.log(
        "📄 Sending PDF directly to Gemini..."
      );

      const pdfBase64 =
        req.file.buffer.toString("base64");

      const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the uploaded RESUME PDF against the JOB DESCRIPTION.

IMPORTANT:
- Read the entire PDF carefully.
- Use both the text and visual/layout information in the PDF.
- The resume may contain columns, sections, tables, lines, headings, images, or other visual formatting.
- Do NOT assume that missing extracted text means the resume is empty.
- Identify only information that is actually visible or readable in the uploaded resume.
- Do NOT invent or assume facts about the candidate.
- Do NOT invent names, dates, qualifications, experience, skills, companies, links, or achievements.
- If something cannot be verified from the resume, do not claim that it exists.
- Distinguish between information that is missing and information that simply cannot be verified.
- Evaluate the resume against the job description.
- Return ONLY valid JSON.
- Do not return markdown.
- Do not wrap the JSON in code fences.

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with this EXACT structure:

{
  "atsScore": <number 0-100>,
  "weightedScore": <number 0-100>,

  "componentScores": {
    "contentAndImpact": {
      "score": <number 0-100>,
      "weight": 0.35,
      "weightedContribution": <number>,
      "analysis": "<detailed analysis>"
    },

    "keywordMatch": {
      "score": <number 0-100>,
      "weight": 0.25,
      "weightedContribution": <number>,
      "matchedKeywords": ["keyword1"],
      "missingKeywords": ["keyword1"],
      "analysis": "<detailed analysis>"
    },

    "skills": {
      "score": <number 0-100>,
      "weight": 0.25,
      "weightedContribution": <number>,
      "matchedSkills": ["skill1"],
      "missingSkills": ["skill1"],
      "analysis": "<detailed analysis>"
    },

    "formatting": {
      "score": <number 0-100>,
      "weight": 0.15,
      "weightedContribution": <number>,
      "analysis": "<detailed formatting analysis>"
    }
  },

  "matchedKeywords": ["keyword1"],
  "missingKeywords": ["keyword1"],

  "suggestions": [
    {
      "category": "Content & Impact",
      "priority": "High",
      "suggestion": "Detailed actionable suggestion"
    }
  ],

  "summary": "Brief overall summary of the resume's strengths and weaknesses"
}

SCORING RULES:

Content & Impact (35%):
- Quality of achievements
- Quantifiable results
- Strong action verbs
- Relevant experience
- Career progression
- Specific accomplishments

Keyword Match (25%):
- Compare resume keywords against the job description
- Identify matched keywords
- Identify important missing keywords
- Consider relevant technical terminology
- Do not mark generic words as important keywords

Skills (25%):
- Technical skills
- Tools and technologies
- Soft skills
- Alignment with job requirements

Formatting (15%):
- Resume structure
- Section organization
- Readability
- Consistency
- Bullet points
- Appropriate length
- ATS compatibility
- Columns/layout considerations
- Tables
- Icons
- Images
- Headers and footers

Calculate:

weightedContribution = score × weight

Calculate weightedScore as:

(contentAndImpact score × 0.35)
+
(keywordMatch score × 0.25)
+
(skills score × 0.25)
+
(formatting score × 0.15)

The weightedScore must be between 0 and 100.

Be specific, critical, and actionable.

Do not give a high score simply because the resume looks visually attractive.

Evaluate the actual content against the job description.

Only report facts that can be verified from the uploaded resume.
`;

      contents = [
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64
          }
        }
      ];

      console.log(
        "✅ PDF attached to Gemini request"
      );
    }

    // =======================================================
    // DOCX / TXT
    // =======================================================

    else {
      console.log(
        "📄 Extracting text from non-PDF file..."
      );

      const resumeText =
        await extractTextFromFile(req.file);

      console.log(
        "📄 Extracted text length:",
        resumeText.length
      );

      console.log(
        "📄 Extracted text preview:",
        resumeText.substring(0, 500)
      );

      if (
        !resumeText ||
        !resumeText.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract any text from the uploaded file."
        });
      }

      // Prevent excessively large text requests
      const maxLength = 10000;

      const limitedResumeText =
        resumeText.length > maxLength
          ? resumeText.substring(0, maxLength)
          : resumeText;

      const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze the RESUME against the JOB DESCRIPTION.

IMPORTANT:
- Return ONLY valid JSON.
- Do not return markdown.
- Do not wrap the JSON in code fences.
- Do not invent information.
- Only use information actually present in the resume text.
- Do not assume missing skills, experience, qualifications, dates, names, or achievements.

RESUME TEXT:
${limitedResumeText}

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with this EXACT structure:

{
  "atsScore": <number 0-100>,
  "weightedScore": <number 0-100>,

  "componentScores": {
    "contentAndImpact": {
      "score": <number 0-100>,
      "weight": 0.35,
      "weightedContribution": <number>,
      "analysis": "<detailed analysis>"
    },

    "keywordMatch": {
      "score": <number 0-100>,
      "weight": 0.25,
      "weightedContribution": <number>,
      "matchedKeywords": [],
      "missingKeywords": [],
      "analysis": "<detailed analysis>"
    },

    "skills": {
      "score": <number 0-100>,
      "weight": 0.25,
      "weightedContribution": <number>,
      "matchedSkills": [],
      "missingSkills": [],
      "analysis": "<detailed analysis>"
    },

    "formatting": {
      "score": <number 0-100>,
      "weight": 0.15,
      "weightedContribution": <number>,
      "analysis": "<detailed formatting analysis>"
    }
  },

  "matchedKeywords": [],
  "missingKeywords": [],

  "suggestions": [
    {
      "category": "Content & Impact",
      "priority": "High",
      "suggestion": "Detailed actionable suggestion"
    }
  ],

  "summary": "Brief overall summary"
}

SCORING:
- Content & Impact: 35%
- Keyword Match: 25%
- Skills: 25%
- Formatting: 15%

Calculate weightedContribution using:

score × weight

Calculate weightedScore as the sum of all weighted contributions.

Be specific and actionable.

Only report information that can be verified from the resume.
`;

      contents = [
        {
          text: prompt
        }
      ];

      console.log(
        "✅ Text attached to Gemini request"
      );
    }

    // =======================================================
    // SEND TO GEMINI
    // =======================================================

    console.log(
      "🤖 Sending resume to Gemini for ATS analysis..."
    );

    const response =
      await gemini.models.generateContent({
        model: "gemini-3.6-flash",

        contents: contents,

        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 4096
        }
      });

    console.log(
      "✅ Gemini returned a response"
    );

    // =======================================================
    // READ GEMINI RESPONSE
    // =======================================================

    const rawText = response.text || "";

    console.log(
      "🤖 Gemini response length:",
      rawText.length
    );

    console.log(
      "🤖 Gemini response:",
      rawText.substring(0, 1000)
    );

    if (!rawText.trim()) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    // =======================================================
    // PARSE JSON
    // =======================================================

    let analysis;

    try {
      analysis = JSON.parse(rawText);
    } catch (jsonError) {
      console.error(
        "❌ JSON Parse Error:",
        jsonError.message
      );

      console.error(
        "❌ Raw Gemini response:",
        rawText.substring(0, 2000)
      );

      return res.status(502).json({
        success: false,
        message:
          "AI returned an unexpected response format",
        error: jsonError.message
      });
    }

    // =======================================================
    // NORMALIZE COMPONENT DATA
    // =======================================================

    const contentScore = Number(
      analysis.componentScores
        ?.contentAndImpact?.score ?? 0
    );

    const keywordScore = Number(
      analysis.componentScores
        ?.keywordMatch?.score ?? 0
    );

    const skillsScore = Number(
      analysis.componentScores
        ?.skills?.score ?? 0
    );

    const formattingScore = Number(
      analysis.componentScores
        ?.formatting?.score ?? 0
    );

    // =======================================================
    // CALCULATE WEIGHTED SCORE ON BACKEND
    // =======================================================

    const calculatedWeightedScore =
      Number(
        (
          contentScore * 0.35 +
          keywordScore * 0.25 +
          skillsScore * 0.25 +
          formattingScore * 0.15
        ).toFixed(2)
      );

    // Use Gemini ATS score if available.
    // Otherwise use our calculated weighted score.
    const atsScore = Number(
      analysis.atsScore ?? calculatedWeightedScore
    );

    // =======================================================
    // FORMAT ANALYSIS
    // =======================================================

    const formattedAnalysis = {
      atsScore,

      weightedScore:
        calculatedWeightedScore,

      componentScores: {
        contentAndImpact: {
          score: contentScore,
          weight: 0.35,

          weightedContribution:
            Number(
              (contentScore * 0.35).toFixed(2)
            ),

          analysis:
            analysis.componentScores
              ?.contentAndImpact?.analysis ||
            "No analysis available"
        },

        keywordMatch: {
          score: keywordScore,
          weight: 0.25,

          weightedContribution:
            Number(
              (keywordScore * 0.25).toFixed(2)
            ),

          matchedKeywords:
            Array.isArray(
              analysis.componentScores
                ?.keywordMatch?.matchedKeywords
            )
              ? analysis.componentScores
                  .keywordMatch
                  .matchedKeywords
              : [],

          missingKeywords:
            Array.isArray(
              analysis.componentScores
                ?.keywordMatch?.missingKeywords
            )
              ? analysis.componentScores
                  .keywordMatch
                  .missingKeywords
              : [],

          analysis:
            analysis.componentScores
              ?.keywordMatch?.analysis ||
            "No analysis available"
        },

        skills: {
          score: skillsScore,
          weight: 0.25,

          weightedContribution:
            Number(
              (skillsScore * 0.25).toFixed(2)
            ),

          matchedSkills:
            Array.isArray(
              analysis.componentScores
                ?.skills?.matchedSkills
            )
              ? analysis.componentScores.skills
                  .matchedSkills
              : [],

          missingSkills:
            Array.isArray(
              analysis.componentScores
                ?.skills?.missingSkills
            )
              ? analysis.componentScores.skills
                  .missingSkills
              : [],

          analysis:
            analysis.componentScores
              ?.skills?.analysis ||
            "No analysis available"
        },

        formatting: {
          score: formattingScore,
          weight: 0.15,

          weightedContribution:
            Number(
              (formattingScore * 0.15).toFixed(2)
            ),

          analysis:
            analysis.componentScores
              ?.formatting?.analysis ||
            "No analysis available"
        }
      },

      matchedKeywords:
        Array.isArray(analysis.matchedKeywords)
          ? analysis.matchedKeywords
          : [],

      missingKeywords:
        Array.isArray(analysis.missingKeywords)
          ? analysis.missingKeywords
          : [],

      suggestions:
        Array.isArray(analysis.suggestions)
          ? analysis.suggestions.map(
              (item) => ({
                category:
                  item?.category || "General",

                priority:
                  item?.priority || "Medium",

                suggestion:
                  item?.suggestion ||
                  String(item || "")
              })
            )
          : [],

      summary:
        analysis.summary ||
        "Analysis completed"
    };

    // =======================================================
    // SAVE TO MONGODB
    // =======================================================

    console.log(
      "💾 ABOUT TO SAVE ATS ANALYSIS"
    );

    console.log(
      "👤 User ID:",
      req.user?.userId
    );

    console.log(
      "📝 Job description length:",
      jobDescription.length
    );

    console.log(
      "📊 ATS Score:",
      formattedAnalysis.atsScore
    );

    console.log(
      "📊 Weighted Score:",
      formattedAnalysis.weightedScore
    );

    const savedAnalysis =
      await ATSAnalysis.create({
        user: req.user.userId,

        // Uploaded files are not necessarily saved
        // Resume documents.
        resume: null,

        jobDescription,

        atsScore:
          formattedAnalysis.atsScore,

        weightedScore:
          formattedAnalysis.weightedScore,

        componentScores:
          formattedAnalysis.componentScores,

        matchedKeywords:
          formattedAnalysis.matchedKeywords,

        missingKeywords:
          formattedAnalysis.missingKeywords,

        suggestions:
          formattedAnalysis.suggestions,

        summary:
          formattedAnalysis.summary
      });

    console.log(
      "✅ ATS ANALYSIS SAVED TO MONGODB!"
    );

    console.log(
      "🆔 Saved Analysis ID:",
      savedAnalysis._id
    );

    // =======================================================
    // STATUS
    // =======================================================

    const needsWork =
      formattedAnalysis.atsScore < 70;

    const status =
      formattedAnalysis.atsScore >= 80
        ? "Excellent"
        : formattedAnalysis.atsScore >= 60
        ? "Good"
        : formattedAnalysis.atsScore >= 40
        ? "Needs Work"
        : "Needs Significant Improvement";

    // =======================================================
    // FINAL RESPONSE
    // =======================================================

    res.status(200).json({
      success: true,

      message:
        "ATS analysis completed successfully",

      analysis: formattedAnalysis,

      status,

      needsWork,

      // Return database ID as well
      analysisId: savedAnalysis._id,

      scoreBreakdown: {
        contentAndImpact: {
          score:
            formattedAnalysis
              .componentScores
              .contentAndImpact
              .score,

          weight: "35%",

          contribution:
            formattedAnalysis
              .componentScores
              .contentAndImpact
              .weightedContribution
        },

        keywordMatch: {
          score:
            formattedAnalysis
              .componentScores
              .keywordMatch
              .score,

          weight: "25%",

          contribution:
            formattedAnalysis
              .componentScores
              .keywordMatch
              .weightedContribution
        },

        skills: {
          score:
            formattedAnalysis
              .componentScores
              .skills
              .score,

          weight: "25%",

          contribution:
            formattedAnalysis
              .componentScores
              .skills
              .weightedContribution
        },

        formatting: {
          score:
            formattedAnalysis
              .componentScores
              .formatting
              .score,

          weight: "15%",

          contribution:
            formattedAnalysis
              .componentScores
              .formatting
              .weightedContribution
        },

        total:
          formattedAnalysis.weightedScore
      }
    });
  } catch (error) {
    console.error(
      "❌ analyzeUploadedResume error:",
      error
    );

    console.error(
      "❌ Error message:",
      error.message
    );

    console.error(
      "❌ Error name:",
      error.name
    );

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      console.error(
        "❌ Mongoose validation details:",
        error.errors
      );
    }

    res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message
    });
  }
};

// =========================================================
// ANALYZE SAVED RESUME
// =========================================================

const analyzeResume = async (req, res) => {
  try {
    const {
      resumeId,
      jobDescription
    } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message:
          "Resume ID and job description are required"
      });
    }

    // -------------------------------------------------------
    // FIND RESUME
    // -------------------------------------------------------

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.userId
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    // -------------------------------------------------------
    // CONSTRUCT RESUME TEXT
    // -------------------------------------------------------

    const resumeText = [
      resume.title || "",
      resume.summary || "",

      ...(resume.skills || []),

      ...(resume.experience || []).map(
        (item) =>
          `${item.position || ""} ${
            item.company || ""
          } ${item.description || ""}`
      ),

      ...(resume.projects || []).map(
        (item) =>
          `${item.name || ""} ${
            item.description || ""
          } ${item.technologies || ""}`
      )
    ]
      .join(" ")
      .toLowerCase();

    // -------------------------------------------------------
    // KEYWORD MATCHING
    // -------------------------------------------------------

    const words = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(
        (word) => word.length > 2
      );

    const keywords = [
      ...new Set(words)
    ];

    const matchedKeywords =
      keywords.filter(
        (keyword) =>
          resumeText.includes(keyword)
      );

    const missingKeywords =
      keywords.filter(
        (keyword) =>
          !resumeText.includes(keyword)
      );

    // -------------------------------------------------------
    // ATS SCORE
    // -------------------------------------------------------

    const atsScore =
      keywords.length > 0
        ? Math.round(
            (matchedKeywords.length /
              keywords.length) *
              100
          )
        : 0;

    // -------------------------------------------------------
    // SUGGESTIONS
    // -------------------------------------------------------

    const suggestions = [];

    if (
      keywords.length > 0 &&
      matchedKeywords.length /
        keywords.length <
        0.5
    ) {
      suggestions.push({
        category: "Keywords",
        priority: "High",
        suggestion:
          `Add more relevant skills and keywords from the job description. Missing: ${missingKeywords
            .slice(0, 5)
            .join(", ")}`
      });
    }

    if (
      resume.summary &&
      resume.summary.length < 50
    ) {
      suggestions.push({
        category: "Content & Impact",
        priority: "Medium",
        suggestion:
          "Consider writing a more detailed professional summary."
      });
    }

    if (
      (resume.experience || []).length < 2
    ) {
      suggestions.push({
        category: "Content & Impact",
        priority: "Medium",
        suggestion:
          "Add more work experience or elaborate on your current role with quantifiable achievements."
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        category: "Keywords",
        priority: "Low",
        suggestion:
          "Your resume has good keyword coverage for this job description."
      });
    }

    // -------------------------------------------------------
    // SAVE ANALYSIS
    // -------------------------------------------------------

    const analysis =
      await ATSAnalysis.create({
        user: req.user.userId,

        resume: resumeId,

        jobDescription,

        atsScore,

        weightedScore: atsScore,

        matchedKeywords,

        missingKeywords,

        suggestions,

        summary:
          "Keyword-based ATS analysis completed."
      });

    // -------------------------------------------------------
    // RESPONSE
    // -------------------------------------------------------

    res.status(201).json({
      success: true,

      message:
        "ATS analysis completed successfully",

      analysis
    });
  } catch (error) {
    console.error(
      "❌ analyzeResume error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message
    });
  }
};

// =========================================================
// GET ATS ANALYSIS HISTORY
// =========================================================

const getAnalysisHistory = async (
  req,
  res
) => {
  try {
    const analyses =
      await ATSAnalysis.find({
        user: req.user.userId
      })
        .populate(
          "resume",
          "title"
        )
        .sort({
          createdAt: -1
        });

    res.json({
      success: true,
      analyses
    });
  } catch (error) {
    console.error(
      "❌ getAnalysisHistory error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch ATS analysis history",
      error: error.message
    });
  }
};

// =========================================================
// GET ONE ATS ANALYSIS
// =========================================================

const getAnalysisById = async (
  req,
  res
) => {
  try {
    const analysis =
      await ATSAnalysis.findOne({
        _id: req.params.id,
        user: req.user.userId
      }).populate(
        "resume",
        "title"
      );

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message:
          "ATS analysis not found"
      });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error(
      "❌ getAnalysisById error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch ATS analysis",
      error: error.message
    });
  }
};

// =========================================================
// DELETE ATS ANALYSIS
// =========================================================

const deleteAnalysis = async (
  req,
  res
) => {
  try {
    const analysis =
      await ATSAnalysis.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId
      });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message:
          "ATS analysis not found"
      });
    }

    res.json({
      success: true,
      message:
        "ATS analysis deleted successfully"
    });
  } catch (error) {
    console.error(
      "❌ deleteAnalysis error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete ATS analysis",
      error: error.message
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  analyzeResume,
  analyzeUploadedResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis
};