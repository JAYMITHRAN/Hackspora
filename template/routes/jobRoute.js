const express = require("express");
const jobController = require("../controllers/jobController");
const jobRouter = express.Router();

jobRouter.get("/:role", (req, res) => {
  jobController.getMethod(req, res);
})

module.exports = jobRouter;
