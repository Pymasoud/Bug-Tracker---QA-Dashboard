// API client for Bug Tracker backend.
// Provides convenience wrappers around fetch() for bug-related endpoints.

const BASE_URL = "http://localhost:8000";

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  // Short-circuit for responses with no content (e.g. 204 from DELETE).
  if (response.status === 204) {
    return;
  }

  // Some endpoints may not return JSON.
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  return response.json();
}

export async function fetchBugs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);

  const queryString = params.toString();
  const url = `${BASE_URL}/bugs${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  return handleResponse(response);
}

export async function fetchBug(id) {
  const response = await fetch(`${BASE_URL}/bugs/${id}`);
  return handleResponse(response);
}

export async function createBug(bugData) {
  const response = await fetch(`${BASE_URL}/bugs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bugData),
  });
  return handleResponse(response);
}

export async function updateBug(id, updates) {
  const response = await fetch(`${BASE_URL}/bugs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
}

export async function deleteBug(id) {
  const response = await fetch(`${BASE_URL}/bugs/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}

export async function fetchStats() {
  const response = await fetch(`${BASE_URL}/stats`);
  return handleResponse(response);
}

