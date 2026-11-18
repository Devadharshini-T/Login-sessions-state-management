const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Every real API call emits a browser event so the CN Monitor can display
// observed HTTP request/response metadata (not fabricated sample traffic).
function publishNetworkEvent(event) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("network-monitor:event", { detail: event }));
  }
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const startedAt = Date.now();
  const requestId = `${startedAt}-${Math.random().toString(16).slice(2, 8)}`;
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
    const payload = await response.json().catch(() => ({}));
    const durationMs = Date.now() - startedAt;
    publishNetworkEvent({
      id: requestId, timestamp: new Date().toISOString(), method,
      endpoint: `/api${path}`, status: response.status,
      statusText: response.statusText, durationMs,
      outcome: response.ok ? "SUCCESS" : "HTTP_ERROR",
      message: payload.message || response.statusText
    });
    if (!response.ok) {
      const error = new Error(payload.message || "Request failed.");
      error.status = response.status;
      error.code = payload.code;
      error.errors = payload.errors || [];
      throw error;
    }
    return payload;
  } catch (error) {
    if (!error.status) {
      publishNetworkEvent({
        id: requestId, timestamp: new Date().toISOString(), method,
        endpoint: `/api${path}`, status: "NETWORK_ERROR",
        statusText: "Network error", durationMs: Date.now() - startedAt,
        outcome: "NETWORK_ERROR", message: error.message || "Could not reach the API."
      });
    }
    throw error;
  }
}
