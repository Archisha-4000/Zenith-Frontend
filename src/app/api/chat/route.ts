import { NextRequest, NextResponse } from "next/server";
import { google } from '@ai-sdk/google';
import { streamText } from "ai";
import { redirect } from "./tools";
import { system_prompt } from "./prompt";
import { getUser } from "@civic/auth/nextjs";
import { getUserByEmail } from "@/services/userService";
import { getOrganizationById } from "@/services/organizationService";


export const maxDuration = 55;


export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const civicUser = await getUser();
    const { messages } = body;

    // Get additional user context from MongoDB
    let userContext = "";
    let dbUser = null;
    let organization = null;
    
    if (civicUser?.email) {
      try {
        dbUser = await getUserByEmail(civicUser.email);
        
        if (dbUser) {
          // Get organization details
          try {
            organization = await getOrganizationById(dbUser.org_id);
          } catch (orgError) {
            console.error("Error fetching organization:", orgError);
          }

          userContext = `
## Current User Context
- **Authentication Status**: Authenticated
- **Name**: ${dbUser.name}
- **Email**: ${dbUser.email}
- **Role**: ${dbUser.role}
- **Job Role**: ${dbUser.job_role || 'Not specified'}
- **Seniority**: ${dbUser.seniority}
- **Employee ID**: ${dbUser.employee_id}
- **Skills**: ${dbUser.skills?.length ? dbUser.skills.join(', ') : 'None specified'}
- **Current Workload**: ${dbUser.current_workload || 0}%
- **Performance Rating**: ${dbUser.performance_rating || 'Not rated'}
- **On Leave**: ${dbUser.is_on_leave ? 'Yes' : 'No'}
- **Member Since**: ${new Date(dbUser.created_at).toLocaleDateString()}
${organization ? `
## Organization Context
- **Organization**: ${organization.name}
- **Billing Plan**: ${organization.billing.plan}
- **Account Status**: ${organization.billing.status}
` : ''}

Use this information to personalize responses and provide role-appropriate guidance.
`;
        } else {
          userContext = `
## Current User Context
- **Authentication Status**: Authenticated (Civic)
- **Email**: ${civicUser.email}
- **Database Status**: User not found in organization database
- **Note**: This user may need to complete organization setup or be added to an organization.

`;
        }
      } catch (dbError) {
        console.error("Error fetching user from database:", dbError);
        userContext = `
## Current User Context
- **Authentication Status**: Authenticated (Civic)
- **Email**: ${civicUser.email}
- **Database Status**: Unable to fetch user details
- **Note**: There may be a temporary database connection issue.

`;
      }
    } else {
      userContext = `
## Current User Context
- **Authentication Status**: Not authenticated
- **Note**: User needs to sign in to access personalized features.

`;
    }

    // Combine system prompt with user context
    const enhancedSystemPrompt = system_prompt + userContext;

    // Generate AI response
    const result = await streamText({
      model: google('gemini-2.0-flash-lite'), // Updated to a more stable model
      tools: { redirect },
      system: enhancedSystemPrompt,
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