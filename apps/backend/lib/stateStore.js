const MAX_HISTORY_ENTRIES = 25;

const assessmentHistory = [];
const savedCareerIds = new Set();

const normalizeTimestamp = (value) => {
  const candidate = typeof value === "string" ? value.trim() : "";
  const date = candidate ? new Date(candidate) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const recordAssessment = (entry) => {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const normalized = {
    payload: entry.payload,
    response: entry.response,
    timestamp: normalizeTimestamp(entry.timestamp),
  };

  assessmentHistory.unshift(normalized);

  if (assessmentHistory.length > MAX_HISTORY_ENTRIES) {
    assessmentHistory.length = MAX_HISTORY_ENTRIES;
  }

  return normalized;
};

const getAssessmentHistory = () => assessmentHistory.slice();

const saveCareerInterest = (careerId) => {
  const normalizedId = typeof careerId === "string" ? careerId.trim() : "";

  if (!normalizedId) {
    return false;
  }

  const sizeBefore = savedCareerIds.size;
  savedCareerIds.add(normalizedId);
  return savedCareerIds.size > sizeBefore;
};

const getSavedCareerIds = () => Array.from(savedCareerIds);

module.exports = {
  recordAssessment,
  getAssessmentHistory,
  saveCareerInterest,
  getSavedCareerIds,
};