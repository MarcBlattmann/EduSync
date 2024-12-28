import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // Get the hostname dynamically
  const hostname = requestUrl.hostname;
  const protocol = hostname === 'localhost' ? 'http' : 'https';
  const origin = `${protocol}://${hostname}${hostname === 'localhost' ? ':3000' : ''}`;
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return NextResponse.redirect(`${origin}/sign-in?error=${error.message}`);
    }
  }

  // Always redirect to /protected after successful authentication
  return NextResponse.redirect(`${origin}/protected`);
}
