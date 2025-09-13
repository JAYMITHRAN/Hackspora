// routes/apiRoute.js

const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// Route: /api/
router.get("/", apiController.getMethod);
router.post("/", apiController.postMethod);

module.exports = router;
