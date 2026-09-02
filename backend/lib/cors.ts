// Equivalente al CorsFilter global de CorsConfig.java del backend original.
export const ALLOWED_ORIGINS = new Set(["http://localhost:5173", "http://localhost:3000"]);
export const ALLOWED_METHODS = "GET,POST,PUT,DELETE,PATCH,OPTIONS";

export function isAllowedOrigin(origin: string | null): origin is string {
  return origin !== null && ALLOWED_ORIGINS.has(origin);
}
