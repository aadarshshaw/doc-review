export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/home", "/review/:path*", "/profile", "/toReview"],
};
