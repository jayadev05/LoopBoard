import { Context, Next } from "hono";

/**
 * Middleware to authenticate API requests using the "x-user" header.
 */

const PUBLIC_ROUTES = ["/api/customAuth/login", "/api/customAuth/register",];

export const authMiddleware = async (c: Context, next: Next) => {

  
  if (PUBLIC_ROUTES.includes(c.req.path)) {
    return  next();
  }

  const userHeader = c.req.header("x-user");
  
  
  if (!userHeader) {
   console.log('no user in header');
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  try {
    const user = JSON.parse(userHeader);
    console.log('user parsed and passed on to next req',user);
    c.set("user", user); // Attach user object to request context
    
    await next();
  } catch (error) {
    console.error('Error parsing user data:', error);
    return c.json({ error: "Invalid user data" }, 400);
  }
};