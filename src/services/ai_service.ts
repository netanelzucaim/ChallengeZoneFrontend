import apiClient from "./api-client"; 

const getChatResponse = async (messages: { role: string; content: string }[]) => {
  try {
    const response = await apiClient.post("/ai/groq", { messages });
    return response.data.output; 
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return "An error occurred while fetching response.";
  }
};

export default { getChatResponse };