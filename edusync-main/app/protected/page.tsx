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
      <Sidebar />
      <div>
        <h1 className="WelcomeText">Welcome, {user.email.split('@')[0]}</h1>
      </div>
    </>
  );
}
