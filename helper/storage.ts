export const SESSION_TOKEN = {
  get: () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("session_token");
  },
  set: (token: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("session_token", token);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("session_token");
  },
};

export const SESSION_CONVERSATION_ID = {
  get: () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("session_conversation_id");
  },
  set: (id: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("session_conversation_id", id);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("session_conversation_id");
  },
};

export const SESSION_ID = {
  get: () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("session_id");
  },
  set: (id: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("session_id", id);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("session_id");
  },
};
