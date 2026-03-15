export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  // Fail fast in dev so missing env vars are obvious.
  // eslint-disable-next-line no-console
  console.warn("VITE_API_BASE_URL is not set. API calls will fail.");
}
