const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("select_token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials, isAdmin = false) {
    const endpoint = isAdmin ? "/admin/login" : "/auth/login";
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData, isAdmin = false) {
    const endpoint = isAdmin ? "/admin/signup" : "/auth/signup";
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout(sessionId) {
    return this.request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
  }

  // Evaluation track endpoints
  async startEvaluation() {
    return this.request("/auth/evaluation/start", {
      method: "POST",
    });
  }

  async updateEvaluationStep(sessionId, stepNumber, stepName) {
    return this.request("/auth/evaluation/step", {
      method: "POST",
      body: JSON.stringify({ sessionId, stepNumber, stepName }),
    });
  }

  async completeEvaluation(sessionId, results) {
    return this.request("/auth/evaluation/complete", {
      method: "POST",
      body: JSON.stringify({ sessionId, results }),
    });
  }

  // Admin
  async getAdminDashboard() {
    return this.request("/admin/dashboard");
  }

  async getAdminStats() {
    return this.request("/admin/stats");
  }

  async submitFeedback(feedbackData) {
    return this.request("/admin/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    });
  }

  async getFeedback(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/admin/feedback?${queryString}`
      : "/admin/feedback";
    return this.request(endpoint);
  }

  // User
  async getCurrentUser() {
    return this.request("/auth/me");
  }
}

const apiService = new ApiService();
export default apiService;
