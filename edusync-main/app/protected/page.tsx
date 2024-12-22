import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { Children } from "react";
import Sidebar from "@/components/Sidebar/Sidebar"; // Import Sidebar component

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <Sidebar /> {/* Add Sidebar component */}
      <div className="protected-content">
        <h1>You are logged in</h1>
        <button onClick={signOutAction}>Sign out</button>
      </div>
    </>
  );
}
