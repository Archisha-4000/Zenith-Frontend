import { tool } from "ai";
import { z } from "zod";

// Define the redirect tool 
export const redirect = tool({
    description: 'Redirect the user or doctor to the correct relevant page based on whether they are a user or doctor.',
    parameters: z.object({
        page_name: z.string().describe('The page to redirect the user or doctor to.')
    }),
    execute: async ({ page_name }) => {
        console.log("Redirecting to page:", page_name);
        // This just returns the page to redirect to, the actual redirection happens client-side
        return { success:true };
    }
});

