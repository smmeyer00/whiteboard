import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Requires auth for all routes except sign-in and sign-up.
 * If not needed for project, remove this and just:
 * export default clerkMiddleware();
 *
 * Can also customize use this pattern to customize public/protected routes as needed
 */
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
