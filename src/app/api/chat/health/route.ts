import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const hasGoogleKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    return NextResponse.json({
      status: "Chat API is running",
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleApiKey: hasGoogleKey,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    );
  }
}
