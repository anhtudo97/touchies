import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const ignoreRoute = createRouteMatcher([
    "/sentry-example-page"
]);

export default clerkMiddleware(async (auth, req) => {
    // Your Clerk authentication logic here
    if (!ignoreRoute(req)) {
        await auth.protect(); // Protect the route if it matches the defined criteria
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};