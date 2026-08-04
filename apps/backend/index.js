require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/apiRoute");
const jobRouter = require("./routes/jobRoute");
const chatRouter = require("./routes/chatRoute");
const {
  getAssessmentHistory,
  getSavedCareerIds,
  saveCareerInterest,
} = require("./lib/stateStore");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3002")
  .split(",")
  .map((origin) => origin.trim());

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", router);

app.use("/api/job", jobRouter);
app.use("/api/chatbot", chatRouter);

app.get("/api/assessments/history", (_req, res) => {
  res.json({ history: getAssessmentHistory() });
});

app.post("/api/careers/save", (req, res) => {
  const careerId = typeof req.body?.careerId === "string" ? req.body.careerId.trim() : "";

  if (!careerId) {
    return res.status(400).json({ error: "careerId is required" });
  }

  const isNew = saveCareerInterest(careerId);

  return res.json({
    saved: true,
    careerId,
    alreadySaved: !isNew,
    savedCareers: getSavedCareerIds(),
  });
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
