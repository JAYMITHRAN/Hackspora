const express = require("express");
const chatController = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.post("/", chatController.sendMessage);

module.exports = chatRouter;
