import Link from "next/link";
export default async function Index() {
  return (
    <>
      <Link href={"/sign-in"}>
            <button>Login</button>
      </Link>
    </>
  );
}
