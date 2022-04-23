import { trpc } from "@/backend/utils/trpc";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["question.getAll"]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(data);
  return (
    <div>
      <p>got it</p>
    </div>
  );
};

export default Home;
