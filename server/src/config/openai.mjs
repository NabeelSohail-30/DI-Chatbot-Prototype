import { OpenAI } from "langchain/llms/openai";

export function createOpenAIClient(apiKey) {
    return new OpenAI(apiKey);
}