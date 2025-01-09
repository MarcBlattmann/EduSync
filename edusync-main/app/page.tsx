import Link from "next/link";
import TopBar from "@/components/TopBar/TopBar";

export default async function Index() {
  return (
    <main>
      <TopBar />
      <Link href={"/sign-in"}>
            <button>Login</button>
      </Link>
    </main>
  );
}
