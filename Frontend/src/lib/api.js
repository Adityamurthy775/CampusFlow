export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:4000").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  const formData = options.body instanceof FormData;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...options,
      headers: formData ? options.headers : { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error(`CampusFlow API is unavailable at ${API_BASE_URL}. Start the backend with "npm start" from the Backend folder.`);
  }
  const text = await response.text();
  const body = text ? (() => { try { return JSON.parse(text); } catch { return { message: text }; } })() : {};
  if (!response.ok) {
    const error = new Error(body.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.fields = body.fields || [];
    throw error;
  }
  return body;
}

async function download(path, filename) {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: "include" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Download failed");
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: "POST", body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: "DELETE" }),
  upload: (path, data, method = "POST") => request(path, { method, body: data }),
  download,
};
