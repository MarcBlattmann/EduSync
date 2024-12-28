import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import "./dashboard.css";

async function fetchDashboardData(supabase: any, userId: string) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const { count } = await supabase
    .from('planner_items')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .gte('date', todayStr)
    .lt('date', nextWeekStr);

  return { nextWeekCount: count || 0 };
}

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { nextWeekCount } = await fetchDashboardData(supabase, user.id);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="welcome-text">Welcome, {user.email.split('@')[0]}</h1>
        <div className="stat-card">
          <h3>Coming up next week</h3>
          <div className="stat-number">{nextWeekCount}</div>
          <p>tasks scheduled</p>
        </div>
      </div>
    </div>
  );
}
