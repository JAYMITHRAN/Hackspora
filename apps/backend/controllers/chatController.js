const LLM_BASE_URL = process.env.LLM_SERVICE_BASE_URL || "http://localhost:11435";
const DEFAULT_MODEL = process.env.LLM_MODEL || "llama3.2:1b";
const VALID_ROLES = new Set(["system", "user", "assistant"]);
const MAX_MESSAGE_LENGTH = 4000;

const sanitizeMessages = (messages = []) =>
  messages.map((message) => {
    const role = VALID_ROLES.has(message?.role) ? message.role : "user";
    const content = typeof message?.content === "string" ? message.content : String(message?.content ?? "");

    return {
      role,
      content: content.slice(0, MAX_MESSAGE_LENGTH),
    };
  });

const chatController = {
  sendMessage: async (req, res) => {
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const payload = {
      model: typeof body.model === "string" && body.model.trim() ? body.model.trim() : DEFAULT_MODEL,
      messages: sanitizeMessages(messages),
      stream: Boolean(body.stream),
      options: typeof body.options === "object" && body.options !== null ? body.options : {},
    };

    try {
      const response = await fetch(`${LLM_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`LLM request failed with ${response.status}`);
      }

      const result = await response.json();
      return res.json(result);
    } catch (error) {
      console.error("LLM chat error:", error);
      return res.status(502).json({ error: "Failed to contact LLM service" });
    }
  },
};

module.exports = chatController;
