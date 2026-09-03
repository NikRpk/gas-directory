import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export const dynamic = "force-dynamic";

/** Returns the current signed-in user and whether they are an admin. */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null, isAdmin: false });
    }
    return NextResponse.json({
      user: { email: user.email },
      isAdmin: isAdminEmail(user.email),
    });
  } catch {
    return NextResponse.json({ user: null, isAdmin: false });
  }
}
