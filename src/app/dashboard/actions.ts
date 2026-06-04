"use server";

import { UploadInputSchema } from "@/types";

export async function uploadDataAction(data: unknown) {
  try {
    const parsed = UploadInputSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Validation failed: " + JSON.stringify(parsed.error.issues) };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Unknown error" };
  }
}
