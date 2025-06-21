import { tool } from "ai";
import { z } from "zod";

// Define the redirect tool for role-based navigation
export const redirect = tool({
    description: 'Redirect users to the appropriate page based on their role (admin, manager, employee) and the requested functionality.',
    parameters: z.object({
        page_name: z.string().describe(`The page to redirect to. Valid routes include:
        - Admin: /admin, 
        - Manager: /manager,
        - Employee: /employee,
        - Setup: /setup (for onboarding)`)
    }),
    execute: async ({ page_name }) => {
        console.log("Redirecting to page:", page_name);
        
        // Validate the page route
        const validRoutes = [
            // Admin routes
            '/admin',
            // Manager routes  
            '/manager', 
            // Employee routes
            '/employee',
            // Setup
            '/setup'
        ];
        
        if (!validRoutes.includes(page_name)) {
            return { 
                success: false, 
                error: `Invalid route: ${page_name}. Please use a valid route for the user's role.` 
            };
        }
        
        // Return success - actual redirection happens client-side
        return { 
            success: true, 
            redirect_url: page_name,
            message: `Redirecting to ${page_name}` 
        };
    }
});

