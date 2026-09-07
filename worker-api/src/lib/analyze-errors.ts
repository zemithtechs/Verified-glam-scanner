// Port of analyze-scan's error handling — AnalysisError + OpenAI error
// classification, unchanged logic.
export class AnalysisError extends Error {
  status: number;
  errorCode: string;

  constructor(status: number, errorCode: string, message: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

export function classifyOpenAIErrorCode(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("content policy") || lower.includes("content_filter")) return "CONTENT_POLICY";
  if (lower.includes("invalid_image") || lower.includes("image_process")) return "INVALID_IMAGE";
  if (lower.includes("429") || lower.includes("rate_limit")) return "RATE_LIMITED";
  if (lower.includes("timeout") || lower.includes("deadline-exceeded")) return "ANALYSIS_TIMEOUT";
  if (lower.includes("empty openai response")) return "ANALYSIS_TIMEOUT";
  return "ANALYSIS_FAILED";
}

export function mapOpenAIErrorMessage(message: string): string {
  const code = classifyOpenAIErrorCode(message);
  switch (code) {
    case "CONTENT_POLICY":
      return "Analysis blocked by content policy. Try a clearer front-facing photo.";
    case "INVALID_IMAGE":
      return "Could not process this image. Please use a clearer selfie.";
    case "RATE_LIMITED":
      return "Service is busy. Please wait a moment and try again.";
    case "ANALYSIS_TIMEOUT":
      return "Analysis took too long. Please try with a clearer photo.";
    default:
      return message.length > 200 ? "Something went wrong. Please try again." : message;
  }
}

export function throwOpenAIError(rawText: string, status: number): never {
  const lower = rawText.toLowerCase();
  if (status === 429 || lower.includes("rate_limit")) {
    throw new AnalysisError(429, "RATE_LIMITED", "Service is busy. Please wait a moment and try again.");
  }
  if (lower.includes("invalid_image") || lower.includes("image_process")) {
    throw new AnalysisError(400, "INVALID_IMAGE", "Could not process this image. Please use a clearer selfie.");
  }
  throw new AnalysisError(500, classifyOpenAIErrorCode(rawText), mapOpenAIErrorMessage(rawText));
}
