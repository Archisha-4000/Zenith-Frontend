import { NextRequest, NextResponse } from "next/server";
import { google } from '@ai-sdk/google';
import { streamText } from "ai";
import { redirect } from "./tools";
import { system_prompt } from "./prompt";

export const maxDuration = 55;


export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { messages } = body;

    // Generate AI response
    const result = await streamText({
      model: google('gemini-2.0-flash-lite'), // Updated to a more stable model
      tools: { redirect },
      system: system_prompt,
      messages,
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("Error handling POST request:", error);
    
    // Provide more specific error messages
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific error types
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or missing API key for AI service";
        statusCode = 401;
      } else if (error.message.includes("model")) {
        errorMessage = "AI model configuration error";
        statusCode = 500;
      } else if (error.message.includes("quota") || error.message.includes("limit")) {
        errorMessage = "AI service quota exceeded. Please try again later.";
        statusCode = 429;
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Network error connecting to AI service";
        statusCode = 503;
      }
    }
    
    // Log more details for debugging
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : error,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { error: `Failed to process the request: ${errorMessage}` },
      { status: statusCode }
    );
  }
}