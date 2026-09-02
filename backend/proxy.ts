import { NextResponse, type NextRequest } from "next/server";
import { ALLOWED_METHODS, isAllowedOrigin } from "@/lib/cors";

function withCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return response;

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  response.headers.set(
    "Access-Control-Allow-Headers",
    request.headers.get("access-control-request-headers") ?? "*",
  );
  response.headers.set("Vary", "Origin");
  return response;
}

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return withCorsHeaders(new NextResponse(null, { status: 204 }), request);
  }
  return withCorsHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: "/api/:path*",
};
