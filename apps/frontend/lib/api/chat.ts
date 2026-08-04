import { dataManager } from "@/lib/utils/data-manager"
import { apiClient } from "@/lib/utils/api-client"

export interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  metadata?: any
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}


interface ChatServiceResponse {
  id?: string
  message?: {
    role?: string
    content?: string
  }
  timestamp?: string
  metadata?: any
}

interface StoredChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
  metadata?: any
}

const CHAT_CONVERSATION_KEY = "chat-conversation-id"

const createConversationId = () => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const getStorage = () => (typeof window === "undefined" ? null : window.localStorage)

const toStoredMessage = (message: ChatMessage): StoredChatMessage => ({
  ...message,
  timestamp: message.timestamp.toISOString(),
})

const fromStoredMessage = (message: StoredChatMessage): ChatMessage => ({
  ...message,
  timestamp: new Date(message.timestamp),
})

const getConversationId = (): string => {
  const storage = getStorage()
  if (!storage) {
    return createConversationId()
  }

  const existing = storage.getItem(CHAT_CONVERSATION_KEY)
  if (existing && existing.trim()) {
    return existing
  }

  const nextId = createConversationId()
  storage.setItem(CHAT_CONVERSATION_KEY, nextId)
  return nextId
}

const getHistoryKey = (conversationId?: string) => `chat-${conversationId || getConversationId()}`

export const saveChatHistory = (messages: ChatMessage[], conversationId?: string): void => {
  const storage = getStorage()
  if (!storage) return

  storage.setItem(getHistoryKey(conversationId), JSON.stringify(messages.map(toStoredMessage)))
}

export const readChatHistory = (conversationId?: string): ChatMessage[] => {
  const storage = getStorage()
  if (!storage) return []

  try {
    const raw = storage.getItem(getHistoryKey(conversationId))
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((item): item is StoredChatMessage => Boolean(item && item.id && item.type && item.content && item.timestamp))
      .map(fromStoredMessage)
  } catch (error) {
    console.error("Failed to read chat history:", error)
    return []
  }
}

export const clearPersistedChatHistory = (conversationId?: string): void => {
  const storage = getStorage()
  if (!storage) return

  storage.removeItem(getHistoryKey(conversationId))
}

export async function sendChatMessage(userInput: string): Promise<ChatMessage> {
  try {
    const requestData = {
      model: "llama3.2:1b",
      messages: [
        {
          role: "system",
          content: `You are a helpful student career guidance chatbot. Always provide output in a **structured, human-readable text format** with clear headings and bullet points. Follow this format:

Course Title: <Career Title based on user input>

1. Introduction:
- Brief overview of the career (5-7 lines).
- Benefits: <bullet points>
- Merits: <bullet points>
- Demerits: <bullet points>
- Mental Requirements: <bullet points>

2. Academic Courses:
- Undergraduate: <list of courses>
- Postgraduate: <list of courses>
- Specializations: <list of optional specializations>

3. Core and Optional Skills:
- Core Skills: <list of mandatory skills>
- Optional Skills: <list of good-to-have skills>

4. Roles and Responsibilities:
- <Role 1>: <Description>
- <Role 2>: <Description>
- ...

5. Certifications:
- <Certification 1>: <Official link>
- <Certification 2>: <Official link>
- ...

6. Alternative Opportunities:
- <Related Career 1>
- <Related Career 2>
- ...

7. Salary Insights:
- Junior Level: <average and range in INR>
- Senior Level: <average and range in INR>
- Note: <any variations due to location, experience, or certification>

8. Current Trends and Updates:
- <Trend 1>
- <Trend 2>
- ...

9. Roadmap:
- Step 1: <Description>
  Topics: <bullet points>
  Resources: <official links>
- Step 2: <Description>
  Topics: <bullet points>
  Resources: <official links>
- ...

Always include trusted external learning or certification links (mandatory):
- W3Schools (https://www.w3schools.com/)
- GeeksforGeeks (https://www.geeksforgeeks.org/)
- Roadmap.sh (https://roadmap.sh/)

The output must be fully structured in **text** with headings and bullet points, ready to display to a user. Do not output JSON.`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      stream: false,
    }

    const data = await apiClient.post<ChatServiceResponse>("/api/chatbot", requestData)

    const botMessage: ChatMessage = {
      id: data?.id || Math.random().toString(36).substr(2, 9),
      type: "bot",
      content: data?.message?.content || "I'm sorry, I couldn't generate a response.",
      timestamp: data?.timestamp ? new Date(data.timestamp) : new Date(),
      metadata: data?.metadata || null
    }

    return botMessage
  } catch (error) {
    console.error("Error sending career message:", error)
    const message = error instanceof Error ? error.message : "Failed to get career guidance. Please try again."
    throw new Error(message)
  }
}

export async function getChatHistory(
  conversationId?: string
): Promise<ChatMessage[]> {
  try {
    return readChatHistory(conversationId)
  } catch (error) {
    console.error("Failed to fetch chat history:", error)
    return []
  }
}

export async function clearChatHistory(conversationId?: string): Promise<void> {
  try {
    clearPersistedChatHistory(conversationId)
  } catch (error) {
    console.error("Failed to clear chat history:", error)
  }
}
