import Tesseract from "tesseract.js";
import { toast } from "sonner";

export async function ocrImage(dataUrl: string): Promise<string> {
  try {
    toast.loading("Extracting text...");
    const result = await Tesseract.recognize(dataUrl, "eng");
    const text = result.data.text.trim();
    if (!text) throw new Error("No text found in image");
    return text;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "OCR processing failed. Try a clearer image.",
    );
  }
}
