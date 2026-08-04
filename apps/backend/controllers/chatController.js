const LLM_BASE_URL = process.env.LLM_SERVICE_BASE_URL || "http://localhost:11435";
const DEFAULT_MODEL = process.env.LLM_MODEL || "llama3.2:1b";
const VALID_ROLES = new Set(["system", "user", "assistant"]);
const MAX_MESSAGE_LENGTH = 4000;
const { Readable } = require("stream");

const sanitizeMessages = (messages = []) =>
  messages.map((message) => {
    const role = VALID_ROLES.has(message?.role) ? message.role : "user";
    const content = typeof message?.content === "string" ? message.content : String(message?.content ?? "");

    return {
      role,
      content: content.slice(0, MAX_MESSAGE_LENGTH),
    };
  });

const buildFallbackResponse = (messages = []) => {
  const lastUserMessage = [...messages].reverse().find((message) => message?.role === "user")?.content || "";
  const summary = lastUserMessage.trim() || "your career question";

  const responseText = `I am having trouble reaching the live LLM service right now, so here is a fast fallback response based on ${summary}.

If you are exploring a career move, the safest next step is to clarify three things:
- Your strongest skills
- The kind of work you want to do every day
- The industries or roles that match your interests

Share your education level, experience, and 2 to 3 interests, and I can help narrow down a practical path, skills to build, and next actions.`;

  return {
    id: `fallback-${Date.now()}`,
    message: {
      role: "assistant",
      content: responseText,
    },
    created_at: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    metadata: {
      source: "fallback",
      model: DEFAULT_MODEL,
    },
  };
};

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

      if (payload.stream) {
        res.status(response.status);
        const contentType = response.headers.get("content-type") || "application/json";
        res.setHeader("Content-Type", contentType);

        if (!response.body) {
          return res.end();
        }

        Readable.fromWeb(response.body).pipe(res);
        return;
      }

      const result = await response.json();
      return res.json(result);
    } catch (error) {
      console.error("LLM chat error:", error);
      return res.json(buildFallbackResponse(payload.messages));
    }
  },
};

module.exports = chatController;
