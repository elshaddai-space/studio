
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that require authentication.
// The homepage "/" is public by default if not matched here.
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // If user is not authenticated, redirect to sign-in page
  }
  // No explicit publicRoutes array needed here if we rely on isProtectedRoute
  // to implicitly define public routes (those not matched).
  // For clarity with Clerk's patterns, an alternative is to list public routes:
  // publicRoutes: ['/', '/some-other-public-route']
  // However, the current setup is fine. The error is likely deeper.
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

