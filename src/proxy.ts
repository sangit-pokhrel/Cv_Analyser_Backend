import { NextResponse, NextRequest  } from "next/server";
export default function proxy(req:NextRequest) {
  const token = req.cookies.get("firebaseToken")?.value;
  
  if (!token) {
  const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

 else{
   return NextResponse.next();
 }
}

export const config = {
  matcher: ["/home/:path*", "/jobs/:path*"],
};
