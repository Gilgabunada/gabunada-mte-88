import { reactive } from "vue";

function parseJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const authState = reactive({
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),

  setSession({ token, user }) {
    this.token = token || "";
    const decoded = token ? parseJwtPayload(token) : null;
    this.user = user && typeof user === "object" ? { ...decoded, ...user } : decoded;

    if (this.token) localStorage.setItem("token", this.token);
    else localStorage.removeItem("token");

    if (this.user) localStorage.setItem("user", JSON.stringify(this.user));
    else localStorage.removeItem("user");
  },

  clearSession() {
    this.setSession({ token: "", user: null });
  },

  get isAdmin() {
    const u = this.user || {};
    const roleVal = String(u.role || u.userType || "").toLowerCase();
    return Boolean(u.isAdmin === true || roleVal === "admin");
  },
});