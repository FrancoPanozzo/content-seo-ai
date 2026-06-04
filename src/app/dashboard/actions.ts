"use server";

import { UploadSchema } from "@prisma/generated/zod";

export async function uploadDataAction(data: unknown) {
  try {
    console.log("----- RECEIVED UPLOAD DATA -----");
    console.log(JSON.stringify(data, null, 2));

    const parsed = UploadSchema.safeParse(data);
    if (!parsed.success) {
      console.warn("Note: Uploaded JSON does not strictly match UploadSchema:", parsed.error.issues);
      return { success: true, warning: "Logged to console, but missing some fields." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to handle Upload data:", error);
    return { success: false, error };
  }
}
