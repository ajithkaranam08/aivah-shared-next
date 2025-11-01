export const SESSION_STORAGE = {
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
}