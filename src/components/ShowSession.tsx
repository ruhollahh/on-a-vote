import { trpc } from "@/backend/utils/trpc";
import Link from "next/link";

export const ShowSession = () => {
  const { data: session, isLoading: isSessionLoading } = trpc.useQuery([
    "next-auth.getSession",
  ]);
  if (isSessionLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {session ? (
        <p>Signed in as {session?.user?.email}</p>
      ) : (
        <Link href="/api/auth/signin">Sign in</Link>
      )}
    </div>
  );
};
