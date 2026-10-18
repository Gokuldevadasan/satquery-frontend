import type { AnalysisResponse } from "@/types/chat";

function getBackendUrl(): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim().replace(/\/$/, "");
  if (!backendUrl) throw new Error("BACKEND_NOT_CONFIGURED");
  return backendUrl;
}

function isAnalysisResponse(value: unknown): value is AnalysisResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "status" in value &&
    "input" in value &&
    "terrain" in value &&
    "location" in value &&
    "raster" in value &&
    "analysis" in value &&
    "spectral" in value &&
    "weather" in value &&
    "model" in value &&
    "errors" in value &&
    "diagnostics" in value
  );
}

export async function analyzeSatelliteImages(images: File[]): Promise<AnalysisResponse[]> {
  const backendUrl = getBackendUrl();
  return Promise.all(
    images.map(async (image) => {
      const formData = new FormData();
      formData.append("image", image);
      let response: Response;
      try {
        response = await fetch(`${backendUrl}/analyze`, {
          method: "POST",
          body: formData,
        });
      } catch {
        throw new Error("BACKEND_UNAVAILABLE");
      }
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`ANALYSIS_FAILED${detail ? `: ${detail.slice(0, 300)}` : ` (HTTP ${response.status})`}`);
      }
      let data: unknown;
      try {
        data = await response.json();
      } catch {
        throw new Error("INVALID_RESPONSE");
      }
      if (!isAnalysisResponse(data)) throw new Error("INVALID_RESPONSE");
      return data;
    }),
  );
}
