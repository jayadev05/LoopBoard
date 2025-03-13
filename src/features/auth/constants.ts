
export const AUTH_ROUTES = {
    protected: new Set(["/"] as const),
    public: new Set(["/login", "/register"] as const),
    signIn: "/login" as const,
    home: "/" as const,
  };
  
  export const AUTH_COOKIES = {
    customSession: "custom_session" as const,
    nextAuthSession: "next-auth.session-token" as const,
  };