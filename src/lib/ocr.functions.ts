import { createServerFn } from "@tanstack/react-start";
import Tesseract from "tesseract.js";

export const ocrImage = createServerFn({ method: "POST" })
  .inputValidator((data: { dataUrl: string }) => {
    if (!data?.dataUrl?.startsWith("data:image/")) throw new Error("Invalid image");
    return data;
  })
  .handler(async ({ data }) => {
    try {
      const result = await Tesseract.recognize(data.dataUrl, "eng", {
        logger: (m) => console.log("OCR progress:", m),
      });
      const text = result.data.text.trim();
      if (!text) throw new Error("No text found in image");
      return { text };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "OCR processing failed. Try a clearer image.",
      );
    }
  });
