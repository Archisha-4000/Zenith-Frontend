import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export function createActionResult<T>(
  success: boolean,
  data?: T,
  error?: string,
  fieldErrors?: Record<string, string>
): ActionResult<T> {
  return {
    success,
    data,
    error,
    fieldErrors,
  };
}

export async function withErrorHandling<T>(
  action: () => Promise<T>,
  errorMessage = "An error occurred"
): Promise<ActionResult<T>> {
  try {
    const data = await action();
    return createActionResult(true, data);
  } catch (error) {
    console.error(error);
    return createActionResult<T>(false, undefined, errorMessage);
  }
}

export function validateRequired(fields: Record<string, any>): Record<string, string> | null {
  const errors: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      errors[key] = `${key} is required`;
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}
