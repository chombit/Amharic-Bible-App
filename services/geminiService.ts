import { GoogleGenAI, Type } from "@google/genai";
import { ChapterContent, SearchResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getChapter = async (book: string, chapter: number): Promise<ChapterContent> => {
  const prompt = `Please provide the full text of the book "${book}" chapter ${chapter} from the Amharic Bible. Format the output as a valid JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verses: {
              type: Type.ARRAY,
              description: "An array of verses from the chapter.",
              items: {
                type: Type.OBJECT,
                properties: {
                  verseNumber: {
                    type: Type.NUMBER,
                    description: "The verse number."
                  },
                  text: {
                    type: Type.STRING,
                    description: "The Amharic text of the verse."
                  }
                },
                required: ["verseNumber", "text"]
              }
            }
          },
          required: ["verses"]
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as ChapterContent;
  } catch (error) {
    console.error("Error fetching chapter from Gemini API:", error);
    throw new Error("Failed to fetch chapter. Please try again.");
  }
};

export const searchBible = async (query: string): Promise<SearchResult[]> => {
  const prompt = `Search the Amharic Bible for verses containing the keyword "${query}". Return up to 15 most relevant verses. Format the output as a valid JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              description: "An array of search result verses.",
              items: {
                type: Type.OBJECT,
                properties: {
                  book: {
                    type: Type.STRING,
                    description: "The name of the book in Amharic."
                  },
                  chapter: {
                    type: Type.NUMBER,
                    description: "The chapter number."
                  },
                  verseNumber: {
                    type: Type.NUMBER,
                    description: "The verse number."
                  },
                  text: {
                    type: Type.STRING,
                    description: "The Amharic text of the verse."
                  }
                },
                required: ["book", "chapter", "verseNumber", "text"]
              }
            }
          },
          required: ["results"]
        }
      }
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    return parsed.results as SearchResult[];
  } catch (error) {
    console.error("Error searching Bible from Gemini API:", error);
    throw new Error("Failed to perform search. Please try again.");
  }
};
