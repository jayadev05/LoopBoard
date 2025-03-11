
export const AUTH_ROUTES = {
    protected: new Set(["/"] as const),
    public: new Set(["/sign-in", "/sign-up"] as const),
    signIn: "/sign-in" as const,
    home: "/" as const,
  };
  
  export const AUTH_COOKIES = {
    customSession: "custom_session" as const,
    nextAuthSession: "next-auth.session-token" as const,
  };