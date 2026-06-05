const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const pdfParse = require("pdf-parse");
const fs = require("fs");

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text || "";

    const skills = [
      "javascript",
      "react",
      "node",
      "express",
      "mongodb",
      "html",
      "css",
      "git",
      "sql"
    ];

    let foundSkills = [];
    let missingSkills = [];

    // ✅ CLEAN LOGIC (NO DUPLICATES)
    skills.forEach((skill) => {
      if (text.toLowerCase().includes(skill)) {
        foundSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // ✅ CORRECT SCORE (ONLY ONCE)
    const score = Math.round(
      (foundSkills.length / skills.length) * 100
    );

    // optional suggestions
    let suggestions = [];

    if (missingSkills.includes("react")) {
      suggestions.push("Add React projects to improve frontend profile");
    }

    if (missingSkills.includes("node")) {
      suggestions.push("Add backend Node.js projects");
    }

    if (foundSkills.length < 3) {
      suggestions.push("Add more technical skills for better ATS score");
    }

    res.json({
      score: Math.min(score, 100),
      foundSkills,
      missingSkills,
      suggestions,
      totalWords: text.split(" ").length,
      message: "Resume analyzed successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;