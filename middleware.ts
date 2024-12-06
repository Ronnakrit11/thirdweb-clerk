import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ["/", "/pricing", "/api/line-webhook"],
  ignoredRoutes: ["/api/webhook", "/api/line-webhook"],
  beforeAuth: (req) => {
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }
    return null;
  },
});
 
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};