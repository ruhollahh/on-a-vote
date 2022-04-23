import { trpc } from "@/backend/utils/trpc";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["hello.sayit", { text: "client" }]);
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
};

export default Home;
