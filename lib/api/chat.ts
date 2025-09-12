import axios from "axios"
import { dataManager } from "@/lib/utils/data-manager"

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
      stream: false
    }
    console.log("Request Data:", requestData)
    // Send POST request
    const { data } = await axios.post("http://localhost:11434/api/chat", requestData)

    console.log("Response: ",data)
    const botMessage: ChatMessage = {
      id: data.id || Math.random().toString(36).substr(2, 9),
      type: "bot",
      content: data.message.content,
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      metadata: data.metadata || null
    }

    return botMessage
  } catch (error) {
    console.error("Error sending career message:", error)
    throw new Error("Failed to get career guidance. Please try again.")
  }
}

// Usage example


export async function getChatHistory(
  conversationId?: string
): Promise<ChatMessage[]> {
  try {
    const conversationKey = `chat-${conversationId || "default"}`
    const localHistory = dataManager.getLocalStorage<ChatMessage[]>(conversationKey)

    if (localHistory) {
      return localHistory
    }

    const { data } = await axios.get<ChatMessage[]>(
      `http://localhost:11434/api/chat/history/${conversationId}`
    )
    return data
  } catch (error) {
    console.error("Failed to fetch chat history:", error)
    return []
  }
}

export async function clearChatHistory(conversationId?: string): Promise<void> {
  try {
    const conversationKey = `chat-${conversationId || "default"}`
    dataManager.removeLocalStorage(conversationKey)

    if (conversationId) {
      await axios.delete(
        `http://localhost:11434/api/chat/history/${conversationId}`
      )
    }
  } catch (error) {
    console.error("Failed to clear chat history:", error)
  }
}
